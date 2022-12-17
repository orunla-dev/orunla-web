/* eslint-disable no-async-promise-executor */
import { supabase } from "@/config/supabase";

export function fetchAuthorDetails(authors_id) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("authors")
      .select(`*, profiles(*)`)
      .eq("uid", authors_id);
    if (error) reject(error);
    resolve(data);
  });
}

export function fetchAuthorBooks(authors_id) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("books")
      .select(`*, authors(*, profiles(*))`)
      .eq("authors_id", authors_id);
    if (error) reject(error);
    resolve(data);
  });
}

export function fetchAllAuthors(range) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("authors")
      .select("*, profiles(*)")
      .range(range.start, range.end);
    if (error) reject(error);
    resolve(data);
  });
}
