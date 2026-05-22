/**
 * PubMed E-utilities client.
 *
 * Uses NCBI's free E-utilities API to fetch live, fresh research on EBOO /
 * ozone therapy / extracorporeal oxygenation. No auth, no scraping —
 * proper API with documented rate limits (3 requests/sec without an API
 * key, 10/sec with one).
 *
 * Docs: https://www.ncbi.nlm.nih.gov/books/NBK25500/
 *
 * Two-step flow:
 *   1. esearch — keyword query → list of PMIDs
 *   2. esummary — PMIDs → titles, authors, journals, pub dates
 *
 * Results are cached at the Next.js fetch layer with weekly revalidation
 * (`next: { revalidate: 604800 }`) so we don't hammer NCBI.
 */

const EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const REVALIDATE_SECONDS = 60 * 60 * 24 * 7; // weekly

export type PubMedPaper = {
  pmid: string;
  title: string;
  authors: string;
  journal: string;
  pubDate: string;
  year: number | null;
  url: string;
};

/**
 * Search PubMed and return up to `max` recent papers matching the query.
 * Returns an empty array on failure so pages never crash if NCBI is down.
 */
export async function searchPubMed(query: string, max = 5): Promise<PubMedPaper[]> {
  try {
    // 1. esearch — get PMIDs sorted by publication date (descending)
    const searchUrl = new URL(`${EUTILS}/esearch.fcgi`);
    searchUrl.searchParams.set("db", "pubmed");
    searchUrl.searchParams.set("term", query);
    searchUrl.searchParams.set("retmode", "json");
    searchUrl.searchParams.set("retmax", String(max));
    searchUrl.searchParams.set("sort", "pub_date");

    const searchRes = await fetch(searchUrl.toString(), {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!searchRes.ok) return [];
    const searchJson = (await searchRes.json()) as {
      esearchresult?: { idlist?: string[] };
    };
    const ids = searchJson.esearchresult?.idlist ?? [];
    if (ids.length === 0) return [];

    // 2. esummary — resolve titles/authors/journal
    const summaryUrl = new URL(`${EUTILS}/esummary.fcgi`);
    summaryUrl.searchParams.set("db", "pubmed");
    summaryUrl.searchParams.set("id", ids.join(","));
    summaryUrl.searchParams.set("retmode", "json");

    const summaryRes = await fetch(summaryUrl.toString(), {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!summaryRes.ok) return [];
    const summaryJson = (await summaryRes.json()) as {
      result?: Record<string, PubMedSummary> & { uids?: string[] };
    };

    const uids = summaryJson.result?.uids ?? [];
    const papers: PubMedPaper[] = [];

    for (const uid of uids) {
      const r = summaryJson.result?.[uid];
      if (!r || typeof r !== "object") continue;
      const authors = Array.isArray(r.authors)
        ? r.authors
            .slice(0, 3)
            .map((a) => a.name)
            .join(", ") + (r.authors.length > 3 ? ", et al." : "")
        : "";
      const pubDateMatch = (r.pubdate ?? r.epubdate ?? "").match(/^(\d{4})/);
      const year = pubDateMatch ? parseInt(pubDateMatch[1], 10) : null;
      papers.push({
        pmid: uid,
        title: (r.title ?? "").replace(/\.$/, ""),
        authors,
        journal: r.fulljournalname ?? r.source ?? "",
        pubDate: r.pubdate ?? "",
        year,
        url: `https://pubmed.ncbi.nlm.nih.gov/${uid}/`,
      });
    }

    return papers;
  } catch {
    return [];
  }
}

type PubMedSummary = {
  title?: string;
  authors?: { name: string }[];
  fulljournalname?: string;
  source?: string;
  pubdate?: string;
  epubdate?: string;
};

/** Default search for the science page — captures the most relevant EBOO research. */
export const EBOO_SEARCH_QUERY =
  '("EBOO"[Title/Abstract] OR "extracorporeal blood oxygenation"[Title/Abstract] OR "ozone autohaemotherapy"[Title/Abstract] OR "ozonated autohemotherapy"[Title/Abstract])';
