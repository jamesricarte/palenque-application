import express, { Request, response, Response } from "express";
import v1Routes from "./routes/v1";
require("dotenv").config();

import { supabase } from "./config/supabaseClient";
import { Database } from "./database.types";

const app = express();

app.use(express.json());

app.use("/api/v1", v1Routes);

export default app;
