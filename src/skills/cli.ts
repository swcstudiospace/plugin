import { join } from "node:path";
import { defaultHermesSkillsDir, importHermesSkills, loadReport, writeReport } from "./import.ts";

const destDir = join(import.meta.dir, "..", "..", "skills");
const sourceDir = process.env.HERMES_SKILLS_DIR?.trim() || defaultHermesSkillsDir();
const previous = loadReport(join(destDir, ".hermes-import.json"));
const report = importHermesSkills({ sourceDir, destDir, previous });
writeReport(destDir, report);
const kept = report.imported.length + report.updated.length + report.unchanged.length;
console.log(
	`hermes import: kept ${kept} imported=${report.imported.length} updated=${report.updated.length} unchanged=${report.unchanged.length} skipped=${report.skipped.length} conflicted=${report.conflicted.length} redacted=${report.redacted.length}`,
);
if (report.skipped.length) {
	for (const row of report.skipped) console.log(`  skip ${row.name}: ${row.reason}`);
}
