import type { RockInteraction } from "../types";

export const INTERACTIONS: RockInteraction[] = [
  ["pat", "쓰다듬기", "touch", "표면이 아주 조금 따뜻해졌지만 돌입니다.", "pulse"],
  ["knock", "두드리기", "touch", "둔탁한 소리가 났고 돌은 계속 돌입니다.", "nudge"],
  ["polish", "닦기", "utility", "운모가 희미하게 반짝였지만 본질은 돌입니다.", "glint"],
  ["stare", "응시", "observe", "서로 아무 말도 하지 않았고 돌은 돌입니다.", "settle"],
  ["measure", "재기", "utility", "측정값은 바뀌어도 돌이라는 사실은 변하지 않습니다.", "none"],
  ["weigh", "무게 상상", "observe", "무게를 상상했습니다. 상상 속에서도 돌입니다.", "settle"],
  ["light", "빛 비추기", "observe", "석영 결이 번쩍였고 돌은 항상 돌입니다.", "glint"],
  ["hum", "허밍", "ritual", "낮은 진동이 돌 주변을 맴돌았습니다.", "pulse"],
  ["compliment", "칭찬", "ritual", "훌륭한 돌이라고 했습니다. 돌은 받아들였습니다.", "glint"],
  ["question", "철학 질문", "ritual", "질문은 깊었고 대답은 돌이었습니다.", "settle"],
  ["rotate", "돌려보기", "touch", "다른 면도 돌이었습니다.", "nudge"],
  ["tap-code", "모스 부호", "ritual", "신호를 보냈지만 수신된 것은 돌의 침묵입니다.", "nudge"],
  ["cool", "식히기", "utility", "서늘해진 돌은 여전히 돌입니다.", "settle"],
  ["warm", "덥히기", "utility", "온기가 머물렀지만 돌의 정체성은 단단합니다.", "pulse"],
  ["dust", "먼지 털기", "utility", "먼지는 사라졌고 돌은 남았습니다.", "glint"],
  ["name", "별명 붙이기", "ritual", "이름이 생겨도 돌은 항상 돌입니다.", "pulse"],
  ["listen", "귀 기울이기", "observe", "아주 조용한 돌의 소리가 들린 것 같습니다.", "settle"],
  ["photo", "사진 찍기", "utility", "사진 속에서도 돌은 돌입니다.", "glint"],
  ["calendar", "기념일 지정", "ritual", "오늘은 돌을 본 날입니다.", "none"],
  ["align", "북쪽 맞추기", "utility", "방향을 맞췄지만 돌의 방향성은 돌입니다.", "nudge"],
  ["breathe", "숨 고르기", "ritual", "당신은 숨을 골랐고 돌은 가만히 있었습니다.", "settle"],
  ["zoom", "확대 관찰", "observe", "확대할수록 더 많은 돌이 보입니다.", "glint"],
  ["shrink", "축소 관찰", "observe", "작게 보아도 돌입니다.", "settle"],
  ["count", "점 세기", "observe", "반짝임을 세다가 돌이라는 결론에 도착했습니다.", "glint"],
  ["tilt", "기울이기", "touch", "살짝 기울었지만 너무 단단해서 돌입니다.", "nudge"],
  ["coffee", "커피 옆에 두기", "ritual", "커피는 식고 돌은 돌로 남았습니다.", "none"],
  ["meeting", "회의 참석", "ritual", "회의록에는 돌이 참석했다고 적혔습니다.", "settle"],
  ["promise", "약속하기", "ritual", "돌은 약속을 지키는 대신 돌로 있었습니다.", "pulse"],
  ["scan", "광물 스캔", "utility", "스캔 결과: 돌. 세부 결과: 매우 돌.", "glint"],
  ["label", "라벨 붙이기", "utility", "라벨은 설명이고 돌은 실체입니다.", "none"],
  ["archive", "기록하기", "utility", "도감에 한 줄이 추가되어도 돌은 그대로입니다.", "glint"],
  ["wait", "기다리기", "observe", "기다리는 동안 돌은 아주 조금 움직였습니다.", "settle"],
  ["orbit", "주변 맴돌기", "ritual", "중심에는 돌이 있었습니다.", "pulse"],
  ["whisper", "속삭이기", "ritual", "작은 말이 표면에 닿고 돌로 흡수되었습니다.", "glint"],
  ["inspect", "균열 확인", "observe", "깨진 곳은 없습니다. 너무 단단해서 항상 돌입니다.", "settle"],
  ["reset", "다시 보기", "utility", "처음 본 것처럼 보아도 돌입니다.", "none"]
].map(([id, labelKo, category, messageKo, animationKey]) => ({
  id,
  labelKo,
  category,
  messageKo,
  animationKey
})) as RockInteraction[];

export function getInteractionById(id: string) {
  return INTERACTIONS.find((interaction) => interaction.id === id) ?? INTERACTIONS[0];
}
