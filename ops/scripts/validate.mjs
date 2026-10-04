// 설정 문서 검증 — 데모 저장소 루트에서 `node ops/scripts/validate.mjs [--no-rev]`
// CI(.github/workflows/ops-validate.yml)가 push마다 돌리고, 실패하면 직전 정상본으로 자동 복구한다.
// 배포 스크립트(toss-minigames/scripts/portal-config-deploy.mjs)도 푸시 전에 돌린다.
// ⚠️ 이건 보안 장치가 아니다. 앱 번들의 범위 검사가 유일한 방어선이고, 여기는 실수를 일찍 잡는 곳이다.
// ⚠️ 원본은 toss-minigames/tools/portal-ops/validate.mjs — 여기를 직접 고치지 말 것(배포 때 덮어써진다).
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { validateDoc, unknownKeys } from '../lib/remote-core.mjs';

const checkRev = !process.argv.includes('--no-rev');

let failed = false;
const fail = (m) => { console.error('✖ ' + m); failed = true; };

for (const file of ['ops/config.json', 'ops/config-test.json']) {
  let raw;
  try { raw = JSON.parse(readFileSync(file, 'utf8')); } catch (e) { fail(`${file}: JSON 문법 오류 — ${e.message}`); continue; }

  const r = validateDoc(raw);
  if (!r.ok) { for (const e of r.errors) fail(`${file}: ${e}`); continue; }

  // 앱은 모르는 키를 조용히 무시한다(구버전 호환). 여기서는 오타일 가능성이 높으니 막는다.
  const unknown = unknownKeys(raw);
  if (unknown.length) fail(`${file}: 앱이 모르는 키(오타?) — ${unknown.join(', ')}`);

  // rev는 바뀔 때마다 커져야 한다 — 앱은 더 낮은 rev를 무시한다(되돌리기도 새 rev로).
  let prev = null;
  try { prev = JSON.parse(execSync(`git show HEAD~1:${file}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString()); } catch { /* 첫 커밋 */ }
  const changed = checkRev && prev && JSON.stringify(prev) !== JSON.stringify(raw);
  if (changed && !(raw.rev > prev.rev)) fail(`${file}: 내용이 바뀌었는데 rev가 커지지 않았습니다 (${prev.rev} → ${raw.rev})`);

  if (!failed) console.log(`✔ ${file} — rev ${raw.rev}${raw.pending ? ` · 예약 ${raw.pending.effectiveDate}` : ''}`);
}
process.exit(failed ? 1 : 0);
