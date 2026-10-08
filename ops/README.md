# ops/ — 전국민의 미니게임 운영 설정

> 이 저장소의 루트는 **게임물 등급분류용 웹 데모**다. `ops/`는 그와 무관한 운영 설정이며 데모를 바꾸지 않는다.

- 관리 페이지: https://sllee74-ui.github.io/toss-minigames-demo/ops/
- 앱(appName `game-369`)이 읽는 문서: `ops/config.json` **하나**(출시 빌드·점검 빌드 공통). 테스트 문서 `config-test.json`은 2026-10-08 폐지.

## 구조
- 앱 번들의 허용 범위가 **유일한 방어선**이다. 범위를 벗어난 값이 하나라도 있으면 앱은 문서 전체를 무시하고 마지막 정상 설정으로 동작한다.
- `.github/workflows/ops-validate.yml`이 push마다 검증하고, 실패하면 직전 정상본으로 자동 복구한다(오타 방지 — 보안 장치는 아님).
- 킬 스위치만 즉시, 나머지는 다음 날 KST 05:00(또는 지정일)부터 적용된다. `rev`는 저장마다 커진다(앱은 더 낮은 rev를 무시).

## 손대지 말 것
- `ops/index.html`, `ops/scripts/`, `ops/lib/`, 워크플로는 **생성·복사본**이다. 원본은 `toss-minigames/tools/portal-ops/`와
  `packages/shared/src/engagement/remote-core.ts`이고, `node scripts/portal-config-deploy.mjs`가 갱신·커밋·푸시한다.
- `ops/config*.json`은 기획자가 관리 페이지로 바꾸는 **데이터**다. 배포 스크립트는 이 파일을 덮어쓰지 않는다.
