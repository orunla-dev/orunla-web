/* eslint-disable no-async-promise-executor */
import { supabase } from "@/config/supabase";
// import { UID } from "../utils/constants";

export function fetchBooks(range) {
  return new Promise(async (resolve, reject) => {
    const { data, count, error } = await supabase
      .from("books")
      .select(`*, authors(*, profiles(*))`, { count: "estimated" })
      .range(range.start, range.end)
      .order("created_at", { ascending: true });
    if (error) reject(error);
    resolve({ data: data, count: count });
  });
}

export function addABook(payload) {
  return new Promise(async (resolve, reject) => {
    const { error } = await supabase.from("books").insert({ ...payload });
    if (error) reject(error);
    resolve();
  });
}

export function saveABook(payload) {
  return new Promise(async (resolve, reject) => {
    const { error } = await supabase
      .from("books")
      .update({ ...payload })
      .eq("isbn", payload.isbn);
    if (error) reject(error);
    resolve();
  });
}

export function deleteABook(isbn) {
  return new Promise(async (resolve, reject) => {
    const { error } = await supabase.from("books").delete().eq("isbn", isbn);
    if (error) reject(error);
    resolve();
  });
}

export function addAnAuthor(payload) {
  return new Promise(async (resolve, reject) => {
    const { error } = await supabase.from("authors").insert({ ...payload });
    if (error) reject(error);
    resolve();
  });
}
