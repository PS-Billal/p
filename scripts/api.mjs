import { handleContact } from "../server/contact.mjs";
import { loadEnvironment, serve } from "./http-server.mjs";

serve(handleContact, loadEnvironment(), 8787);
