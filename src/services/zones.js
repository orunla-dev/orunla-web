/* eslint-disable no-async-promise-executor */
import { supabase } from "@/config/supabase";
// import { UID } from "../utils/constants";

export function fetchAllZones() {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase.from("zones").select(`*`);
    if (error) reject(error);
    resolve(data);
  });
}
