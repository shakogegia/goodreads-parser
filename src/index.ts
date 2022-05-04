import axios from "axios"
import jsdom from "jsdom"
import { getIdAndUrl, parseBookPage, parseSearchResult } from "./utils"

const { JSDOM } = jsdom;

async function parseBook(url: string) {
  const response = await axios.get(url);
  const result = parseBookPage(new JSDOM(response.data).window.document);
  return { ...result, ...getIdAndUrl(response) }
}

export async function parseByISBN13(isbn13: string){
  try {
    return await parseBook("https://www.goodreads.com/search?q="+isbn13)
  } catch (error) {
    throw error;
  }
};

export async function parseByURL(url: string){
  try {
    return await parseBook(url)
  } catch (error) {
    throw error;
  }
};

export async function search(term: string){
  try {
    const response = await axios.get("https://www.goodreads.com/search?q="+term);
    const result = parseSearchResult(new JSDOM(response.data).window.document);
    return { result }
  } catch (error) {
    throw error;
  }
};
