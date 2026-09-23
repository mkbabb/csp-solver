import { mergeConfig } from "vitest/config";
import base from "../vitest.config";
export default mergeConfig(base, { test: { include: [".plr-place-crit/**/*.test.ts"], coverage: { enabled: false } } });
