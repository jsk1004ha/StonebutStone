import type { RockRarity, RockSpecies } from "../types";

type RockVisual = {
  nameKo: string;
  visualKo: string;
};

const ROCK_VISUALS: RockVisual[] = [
  { nameKo: "운석공 공동석", visualKo: "검은 표면에 둥근 운석 구멍이 파인" },
  { nameKo: "남청 정동석", visualKo: "거친 껍질 안쪽에 짙은 남청 결정이 열린" },
  { nameKo: "사막장미 결정석", visualKo: "모래빛 장미 꽃잎처럼 결정판이 겹친" },
  { nameKo: "적철 층리석", visualKo: "붉은 철빛 층과 검은 줄무늬가 쌓인" },
  { nameKo: "푸른 균열 유리석", visualKo: "푸른 유리 속에 금빛 균열이 지나가는" },
  { nameKo: "백색 벌집 부석", visualKo: "하얀 벌집 구멍이 가득한" },
  { nameKo: "빙결 유리괴석", visualKo: "얼어붙은 투명 유리 조각처럼 보이는" },
  { nameKo: "흑요 절단석", visualKo: "날카롭게 잘린 검은 유리면을 가진" },
  { nameKo: "장미 수정석", visualKo: "연분홍 결정면이 빛나는" },
  { nameKo: "태엽 화석석", visualKo: "작은 원형 화석 무늬가 시계 장치처럼 박힌" },
  { nameKo: "호박 정동 단면석", visualKo: "호박빛 중심을 둥근 정동 단면이 감싼" },
  { nameKo: "황철 결정군", visualKo: "금속빛 입방 결정들이 군집한" },
  { nameKo: "관통 고리석", visualKo: "가운데에 매끈한 구멍이 뚫린" },
  { nameKo: "청록 어망석", visualKo: "청록 표면 위로 그물 같은 금빛 선이 얽힌" },
  { nameKo: "층판 장미석", visualKo: "사막장미 판들이 층층이 포개진" },
  { nameKo: "검은 운석공 부석", visualKo: "검은 부석 표면에 깊은 구멍들이 열린" },
  { nameKo: "복숭아 결정괴", visualKo: "복숭아빛 반투명 결정이 거칠게 뭉친" },
  { nameKo: "얼룩 화강석", visualKo: "흰색과 검은색 광물이 얼룩처럼 섞인" },
  { nameKo: "연수정 결정림", visualKo: "연기빛 수정 기둥들이 숲처럼 솟은" },
  { nameKo: "용암공 기공석", visualKo: "검은 구멍 속에 붉은 용암빛이 비치는" },
  { nameKo: "회색 첨탑석", visualKo: "회색 종유석 첨탑들이 모여 솟은" },
  { nameKo: "남청 균열석", visualKo: "푸른 결정 표면에 하얀 균열망이 퍼진" },
  { nameKo: "흑색 얇은층 판석", visualKo: "검은 얇은 판들이 차곡차곡 눌린" },
  { nameKo: "무지개 회로 결정석", visualKo: "무지개 금속 결정이 회로 도시처럼 솟은" },
  { nameKo: "호랑이 줄무늬 원석", visualKo: "호박색과 검은색 물결 줄무늬가 흐르는" },
  { nameKo: "녹아내린 운석석", visualKo: "검은 운석 아래로 액체 금속처럼 흘러내리는" },
  { nameKo: "달구멍 환공석", visualKo: "회백색 달 표면에 큰 구멍들이 관통한" },
  { nameKo: "백회색 정동 단면석", visualKo: "회백색 고리 안쪽에 호박빛 중심이 열린" },
  { nameKo: "소용돌이 층암석", visualKo: "검은 층리선이 소용돌이처럼 휘어진" },
  { nameKo: "자수정 왕관석", visualKo: "바위 위로 맑은 자수정 기둥들이 왕관처럼 선" },
  { nameKo: "미궁 산호석", visualKo: "표면에 미로 같은 산호 홈이 흐르는" },
  { nameKo: "황철 입방군석", visualKo: "황철석 입방체들이 빽빽하게 붙은" },
  { nameKo: "암모나이트 오팔석", visualKo: "무지갯빛 오팔 속에 암모나이트 나선이 박힌" },
  { nameKo: "분홍 물결 편암", visualKo: "분홍색과 검은색 물결 층이 뒤틀린" },
  { nameKo: "현무 기둥석", visualKo: "검은 육각 기둥들이 낮은 성처럼 솟은" },
  { nameKo: "수정 매달림 판석", visualKo: "어두운 판 아래로 투명 수정들이 매달린" },
  { nameKo: "용암 눈동자석", visualKo: "검은 암석 구멍마다 붉은 불빛이 들어찬" },
  { nameKo: "보랏빛 정동구", visualKo: "보랏빛 결정 동굴이 둥글게 열린" },
  { nameKo: "금빛 파편 흑석", visualKo: "검은 암석 표면에 금빛 파편이 번뜩이는" },
  { nameKo: "백색 해면 공동석", visualKo: "해면처럼 큰 공동이 촘촘히 뚫린" },
  { nameKo: "무지개 회로 괴석", visualKo: "색색의 금속 격자가 회로처럼 엉킨" },
  { nameKo: "나선 고리석", visualKo: "회색 돌이 납작한 나선 고리로 감긴" },
  { nameKo: "수정 왕관군석", visualKo: "투명 수정 기둥들이 작은 왕관처럼 모인" },
  { nameKo: "호박 눈구멍석", visualKo: "회색 돌 표면에 호박빛 둥근 눈들이 박힌" },
  { nameKo: "뒤틀린 고리 편암", visualKo: "휘어진 편암이 고리 모양으로 비틀린" },
  { nameKo: "붉은 띠 구멍돌", visualKo: "붉은 줄무늬와 타원형 구멍이 함께 있는" },
  { nameKo: "금속 격자 부석", visualKo: "검은 격자 골격 사이로 빈 공간이 뚫린" },
  { nameKo: "검은 기포석", visualKo: "반짝이는 검은 기포들이 둥글게 솟은" },
  { nameKo: "하늘 정동석", visualKo: "하늘빛 결정이 열린 작은 정동" },
  { nameKo: "구리 흑수정석", visualKo: "구리빛 모서리와 검은 수정면이 맞물린" },
  { nameKo: "별자리 금선석", visualKo: "어두운 표면 위 금빛 점과 선이 별자리처럼 이어진" },
  { nameKo: "검은 유리 조약돌", visualKo: "젖은 흑요석처럼 매끈하고 둥근" },
  { nameKo: "줄무늬 달걀석", visualKo: "붉고 회색인 줄무늬가 달걀형으로 감긴" },
  { nameKo: "협곡 층리석", visualKo: "굽이친 협곡 같은 층리선이 솟은" },
  { nameKo: "거대 벌집 부석", visualKo: "큰 벌집 구멍이 깊게 파인" },
  { nameKo: "연수정 결정군", visualKo: "연기빛 수정 기둥들이 밝은 뿌리 위에 선" },
  { nameKo: "암흑 운석덩이", visualKo: "거칠고 검은 운석 표면을 가진" },
  { nameKo: "수지상 무늬석", visualKo: "나뭇가지 같은 검은 무늬가 밝은 돌에 번진" },
  { nameKo: "황철 입방정석", visualKo: "금속 입방 결정들이 큰 덩어리로 뭉친" },
  { nameKo: "빙하 유리석", visualKo: "푸른빛 투명 얼음 덩어리처럼 갈라진" },
  { nameKo: "문양 구슬석", visualKo: "둥근 표면에 붉은 원형 문양이 반복된" },
  { nameKo: "산호 꽃다발석", visualKo: "작은 산호 꽃들이 다발처럼 모인" },
  { nameKo: "대리석 고리석", visualKo: "대리석 무늬가 감긴 둥근 고리" },
  { nameKo: "검은 연층 판석", visualKo: "검은 얇은 층들이 동심원처럼 쌓인" },
  { nameKo: "백색 기공석", visualKo: "백색 표면에 크고 작은 기공이 뚫린" },
  { nameKo: "흑요 동굴석", visualKo: "검은 유리 안쪽에 반짝이는 동굴면이 열린" },
  { nameKo: "얼음 결정군", visualKo: "푸른 얼음 결정들이 각지게 뭉친" },
  { nameKo: "갈라진 가뭄석", visualKo: "마른 땅처럼 중심 균열이 벌어진" },
  { nameKo: "붉은 층리 각석", visualKo: "붉은 물결 층리가 각진 면에 드러난" },
  { nameKo: "금속 격자 표석", visualKo: "삼각 금속 격자가 표면을 가른" },
  { nameKo: "붉은 산호 벌집석", visualKo: "붉은 산호 구멍들이 벌집처럼 열린" },
  { nameKo: "꽃양배추 산호석", visualKo: "작은 돌꽃들이 촘촘하게 부푼" },
  { nameKo: "연수정 탑석", visualKo: "연기빛 수정 탑들이 투명한 바닥에서 솟은" },
  { nameKo: "녹색 유리공 기포석", visualKo: "검은 암석 위 녹색 유리 기포가 박힌" },
  { nameKo: "나무나이테 원반석", visualKo: "나이테 같은 둥근 층이 원반으로 감긴" },
  { nameKo: "부유 절벽석", visualKo: "공중섬 같은 절벽 덩어리로 떠오른" },
  { nameKo: "매듭 고리석", visualKo: "두꺼운 돌 고리가 매듭처럼 얽힌" },
  { nameKo: "흑요 소용돌이석", visualKo: "검은 유리 표면이 소용돌이 홈으로 흐르는" },
  { nameKo: "거대 벌집 공동석", visualKo: "크고 깊은 벌집 공동들이 모인" },
  { nameKo: "황금 정동 단면석", visualKo: "검은 테두리 안에 황금빛 정동이 열린" },
  { nameKo: "검은 다공 용암석", visualKo: "검은 용암석에 불규칙한 빈 구멍들이 뚫린" },
  { nameKo: "무지개 조개석", visualKo: "조개껍데기처럼 무지갯빛 선이 부채꼴로 펼친" },
  { nameKo: "에메랄드 원석", visualKo: "초록 결정 기둥이 모암에 박힌" },
  { nameKo: "관통 동굴석", visualKo: "거친 바위 가운데에 동굴 구멍이 뚫린" },
  { nameKo: "투명 수정괴", visualKo: "맑은 흰색 수정 덩어리로 뭉친" },
  { nameKo: "금맥 흑암석", visualKo: "검은 암석 사이로 금빛 맥이 사선으로 흐르는" },
  { nameKo: "유리알 둥지석", visualKo: "둥근 껍질 안에 투명 유리알들이 모인" },
  { nameKo: "무지개 회로 도시석", visualKo: "색색의 금속 결정들이 도시처럼 솟은" },
  { nameKo: "녹색 고리석", visualKo: "녹색과 검은 얼룩이 둥근 고리를 이룬" },
  { nameKo: "붉은 상처 암편", visualKo: "검은 표면 위 붉은 광맥이 상처처럼 드러난" },
  { nameKo: "금속 기포 원반석", visualKo: "둥근 금속 기포들이 원반 표면에 떠오른" },
  { nameKo: "회색 수정 숲석", visualKo: "회색 수정 바늘들이 숲처럼 빽빽하게 솟은" },
  { nameKo: "푸른 정동 단면석", visualKo: "푸른 결정 동굴이 흰 테두리 안에 열린" },
  { nameKo: "장미 구리 광석", visualKo: "장미빛 구리 광물이 거친 표면에 박힌" },
  { nameKo: "복숭아 물결층석", visualKo: "복숭아색과 회색 물결층이 접힌" },
  { nameKo: "사막장미 별꽃석", visualKo: "별꽃 같은 사막장미 결정판이 모인" },
  { nameKo: "눈꽃 흑요석", visualKo: "검은 조약돌 위 하얀 눈꽃 무늬가 핀" },
  { nameKo: "청회색 정동 단면석", visualKo: "청회색 고리 중심에 작은 정동이 열린" },
  { nameKo: "백색 달구멍석", visualKo: "밝은 돌 표면에 달구멍처럼 큰 공동이 파인" },
  { nameKo: "원형 화석 패턴석", visualKo: "검은 바탕 위 둥근 화석 무늬가 반복된" }
];

function rarityFor(index: number): RockRarity {
  if (index % 25 === 0) return "mythic";
  if (index % 10 === 0) return "rare";
  if (index % 3 === 0) return "uncommon";
  return "common";
}

export const ROCKS: RockSpecies[] = ROCK_VISUALS.map((visual, zeroIndex) => {
  const index = zeroIndex + 1;
  const id = `rock-${String(index).padStart(3, "0")}`;
  return {
    id,
    index,
    nameKo: visual.nameKo,
    rarity: rarityFor(index),
    descriptionKo: `${visual.visualKo} 돌입니다. 많이 살펴보아도 결론은 돌입니다.`,
    assetKey: id
  };
});

export function getRockById(id: string) {
  return ROCKS.find((rock) => rock.id === id) ?? ROCKS[0];
}
