/* eslint-disable no-async-promise-executor */
import { supabase } from "@/config/supabase";
// import { UID } from "../utils/constants";

export function fetchBooks() {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("books")
      .select(`*, authors(*, profiles(*))`);
    if (error) reject(error);
    resolve(data);
  });
}
