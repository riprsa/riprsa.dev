import { createFromRoot } from "codama";
import { rootNodeFromAnchor, type IdlV01 } from "@codama/nodes-from-anchor";
import { renderVisitor } from "@codama/renderers-js";

import anchorIdl from "@/service/solana/programs/pumpswap.json";
import path from "path";

const codama = createFromRoot(rootNodeFromAnchor(anchorIdl as IdlV01));

// Render JavaScript.
const generatedPath = path.join("src/service/programs", "pumpswap");
codama.accept(renderVisitor(generatedPath));
