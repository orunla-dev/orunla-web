/* eslint-disable no-async-promise-executor */
import { supabase } from "@/config/supabase";
// import { UID } from "../utils/constants";

export function fetchBooks(range) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("books")
      .select(`*, authors(*, profiles(*))`)
      .range(range.start, range.end);
    if (error) reject(error);
    resolve(data);
  });
}

export function fetchBook(isbn) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("books")
      .select(`*, authors(*, profiles(*))`)
      .eq("isbn", isbn);
    if (error) reject(error);
    resolve(data);
  });
}

export function fetchRelatedBooks(category) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("books")
      .select(`*, authors(*, profiles(*))`)
      .contains("categories", [`${category}`]);
    if (error) reject(error);
    resolve(data);
  });
}

export function fetchBookReview(isbn) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("reviews")
      .select(`*`)
      .eq("isbn", isbn);
    if (error) reject(error);
    resolve(data);
  });
}

// Lists

export function addToList(payload) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("lists")
      .insert({ ...payload })
      .select(`*, books(*, authors(*, profiles(*)))`);
    if (error) reject(error);
    resolve(data);
  });
}

export function removeFromList(list_id) {
  return new Promise(async (resolve, reject) => {
    const { error } = await supabase.from("lists").delete().eq("id", list_id);
    if (error) reject(error);
    resolve();
  });
}

export function fetchList(uid) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("lists")
      .select(`*, books(*, authors(*, profiles(*)))`)
      .eq("profiles_id", uid);
    if (error) reject(error);
    resolve(data);
  });
}

export function addToReading(payload) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("now_reading")
      .insert({ ...payload })
      .select();
    if (error) reject(error);
    resolve(data);
  });
}

export function fetchUserReadingList(uid) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("now_reading")
      .select(`*, books(*, authors(*, profiles(*)))`)
      .eq("profiles_id", uid);
    if (error) reject(error);
    resolve(data);
  });
}

export function fetchReadingInfo(uid, isbn) {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("now_reading")
      .select("*")
      .match({ profiles_id: uid, books_id: isbn });
    if (error) reject(error);
    resolve(data);
  });
}

// export function editReading(payload) {
//   return new Promise(async (resolve, reject) => {
//     const { data, error } = await supabase.from("now_reading")
//   })
// }
