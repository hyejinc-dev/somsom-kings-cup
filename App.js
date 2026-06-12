import React, { useState, useRef } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
  SafeAreaView, Animated, Modal, ScrollView,
  Platform, useWindowDimensions, Image, TextInput, KeyboardAvoidingView,
} from 'react-native';

/* ── 고양이 원본 사진 8장 ── */
const CAT_IMAGES = [
  require('./assets/cats/somsom1.jpg'),
  require('./assets/cats/somsom2.jpg'),
  require('./assets/cats/somsom3.jpg'),
  require('./assets/cats/somsom4.jpg'),
  require('./assets/cats/somsom5.jpg'),
  require('./assets/cats/somsom6.jpg'),
  require('./assets/cats/somsom7.jpg'),
  require('./assets/cats/somsom8.jpg'),
];

const SUIT_ORDER = ['♠','♥','♦','♣'];
const SUITS      = ['♠','♥','♦','♣'];
const RANKS      = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const RED_SUITS  = ['♥','♦'];

const RULES = {
  'A' : { title:'🍻 다같이 마셔라냥!',       color:'#E74C3C', bg:'#FFF0F0', rule:'솜솜이 명령이다냥~ 다 같이 마셔야 한다냥! 🐾',                                               tip:'예외 없다냥 😤' },
  '2' : { title:'👉 지목이다냥!',            color:'#FF8C00', bg:'#FFF5E6', rule:'마실 사람 한 명 골라라냥~ 누구냥? 냥냥? 👀',                                                tip:'신중하게 고르라냥!' },
  '3' : { title:'🙋 내가 마신다냥!',         color:'#E6B800', bg:'#FFFDE7', rule:'뽑은 사람이 직접 마셔야 한다냥~ 😿',                                                       tip:'자업자득이다냥 😂' },
  '4' : { title:'👩 여자만 마셔라냥!',       color:'#E91E8C', bg:'#FFF0F8', rule:'여성분들만 마시는 시간이다냥~ 🎀',                                                          tip:'여자만 해당이다냥!' },
  '5' : { title:'💀 게임 오브 데스다냥!',   color:'#27AE60', bg:'#F0FFF4', rule:'모두 두 명씩 지목하라냥! 지목받은 냥이들끼리 손가락 총 대결이다냥~ 진 냥이가 마신다냥! 🔫', tip:'빵! 각오하라냥 ☠️' },
  '6' : { title:'👨 남자만 마셔라냥!',       color:'#2980B9', bg:'#EBF5FB', rule:'남성분들만 마시는 시간이다냥~ 🐾',                                                          tip:'남자만 해당이다냥!' },
  '7' : { title:'☝️ Seven Heaven이다냥!',    color:'#8E44AD', bg:'#F5EEF8', rule:'하늘을 빨리 가리키라냥~! 가장 느린 냥이가 마신다냥! ⚡',                                  tip:'망설이면 마시는거다냥 😹' },
  '8' : { title:'👫 짝꿍 정하라냥!',         color:'#D35400', bg:'#FEF0E7', rule:'짝꿍을 정하라냥~ 짝꿍이 마실 때마다 같이 마셔야 한다냥! 🐱',                              tip:'다음 카드까지 유지된다냥~' },
  '9' : { title:'🔤 초성 게임이다냥!',       color:'#E74C3C', bg:'#FFF0F0', rule:'초성을 대라냥~ 순서대로 맞혀야 한다냥! 못 맞추면 마시는거다냥! 😼',                       tip:'예: ㅅㄱ → 사과, 수고다냥~' },
  '10': { title:'📋 카테고리다냥!',          color:'#16A085', bg:'#E8F8F5', rule:'카테고리 정하고 순서대로 말하라냥~ 막히면 마시는거다냥! 🐾',                               tip:'예: 지하철역이다냥, 걸그룹이다냥...' },
  'J' : { title:'📏 룰 메이커다냥!',         color:'#2471A3', bg:'#EBF5FB', rule:'새로운 룰을 만들어라냥~! 솜솜이가 지켜볼거다냥 👁️ 어기면 마시는거다냥!',                  tip:'창의적으로 만들라냥 🐾' },
  'Q' : { title:'❓ 퀘스천 마스터다냥!',     color:'#7D3C98', bg:'#F5EEF8', rule:'솜솜이가 질문 마스터가 됐다냥~ 질문에 대답한 냥이가 마셔야 한다냥! 😸',                   tip:'다음 Q까지 유지된다냥 👑' },
  'K' : { title:'👑 킹스컵이다냥!!!',        color:'#B7950B', bg:'#FFFDE7', rule:'가운데 컵에 원하는 만큼 따르라냥~ 네 번째 킹 뽑은 냥이가 원샷이다냥!!! 😱',             tip:'네 번째 킹은 각오하라냥 💀' },
};

function buildDeck() {
  const d = [];
  for (const s of SUITS) for (const r of RANKS) d.push({ suit: s, rank: r });
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

function catForCard(card) {
  const idx = SUIT_ORDER.indexOf(card.suit) * 13 + RANKS.indexOf(card.rank);
  return CAT_IMAGES[idx % CAT_IMAGES.length];
}

/* ── 카드 뒷면 ── */
function CardBack({ cw, ch, style }) {
  return (
    <View style={[{
      width: cw, height: ch,
      backgroundColor: '#FF6B9D',
      borderRadius: 14, borderWidth: 2.5, borderColor: '#C44569',
      justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
      shadowColor: '#C44569', shadowOffset: { width: 2, height: 4 },
      shadowOpacity: 0.4, shadowRadius: 6, elevation: 6,
    }, style]}>
      <View style={{
        width: cw - 12, height: ch - 12, borderRadius: 10,
        borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)',
        justifyContent: 'center', alignItems: 'center',
      }}>
        <Text style={{ fontSize: cw * 0.3 }}>🐾</Text>
        <Text style={{ fontSize: cw * 0.11, color: 'rgba(255,255,255,0.7)', marginTop: 6, fontWeight: '700', letterSpacing: 3 }}>♣ ♠ ♥ ♦</Text>
      </View>
    </View>
  );
}

/* ── 카드 앞면 (고양이 전체 배경) ── */
function CardFace({ card, cw, ch }) {
  if (!card) return null;
  const rule   = RULES[card.rank];
  const isRed  = RED_SUITS.includes(card.suit);
  const corner = isRed ? '#C0392B' : '#1a1a2e';
  const catImg = catForCard(card);

  return (
    <View style={{
      width: cw, height: ch, borderRadius: 14, overflow: 'hidden',
      borderWidth: 2.5, borderColor: rule.color,
      backgroundColor: rule.bg,
      shadowColor: rule.color, shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.35, shadowRadius: 10, elevation: 8,
      justifyContent: 'center', alignItems: 'center',
    }}>
      {/* 고양이 사진 — 카드 안에 통째로 */}
      <Image
        source={catImg}
        style={{ width: cw, height: ch }}
        resizeMode="cover"
      />

      {/* 왼쪽 상단 코너 */}
      <View style={{
        position: 'absolute', top: 6, left: 7,
        backgroundColor: 'rgba(255,255,255,0.88)',
        borderRadius: 7, paddingHorizontal: 5, paddingVertical: 2,
        alignItems: 'center',
      }}>
        <Text style={{ fontSize: cw * 0.15, fontWeight: '900', color: corner, lineHeight: cw * 0.17 }}>{card.rank}</Text>
        <Text style={{ fontSize: cw * 0.13, color: corner, lineHeight: cw * 0.15 }}>{card.suit}</Text>
      </View>

      {/* 오른쪽 하단 코너 (180도) */}
      <View style={{
        position: 'absolute', bottom: 6, right: 7,
        backgroundColor: 'rgba(255,255,255,0.88)',
        borderRadius: 7, paddingHorizontal: 5, paddingVertical: 2,
        alignItems: 'center', transform: [{ rotate: '180deg' }],
      }}>
        <Text style={{ fontSize: cw * 0.15, fontWeight: '900', color: corner, lineHeight: cw * 0.17 }}>{card.rank}</Text>
        <Text style={{ fontSize: cw * 0.13, color: corner, lineHeight: cw * 0.15 }}>{card.suit}</Text>
      </View>
    </View>
  );
}

/* ════════════════════════════════════
   플레이어 설정 화면
════════════════════════════════════ */
function SetupScreen({ onStart }) {
  const { width } = useWindowDimensions();
  const [players, setPlayers] = useState(['']);
  const [input, setInput]     = useState('');

  const addPlayer = () => {
    const name = input.trim();
    if (!name || players.includes(name)) return;
    setPlayers([...players.filter(Boolean), name]);
    setInput('');
  };

  const removePlayer = (i) => setPlayers(players.filter((_, idx) => idx !== i));

  const canStart = players.filter(Boolean).length >= 2;

  return (
    <SafeAreaView style={[ss.root, Platform.OS === 'web' && { height: '100vh' }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={ss.scroll} keyboardShouldPersistTaps="handled">

          {/* 타이틀 */}
          <View style={ss.titleBox}>
            <Image
              source={require('./assets/cats/somsom7.jpg')}
              style={{ width: 160, height: 160, borderRadius: 80 }}
              resizeMode="cover"
            />
            <Text style={ss.title}>솜솜이 킹스컵 🍺</Text>
            <Text style={ss.sub}>플레이어 이름을 입력해 주세요</Text>
          </View>

          {/* 이름 입력 */}
          <View style={ss.inputRow}>
            <TextInput
              style={[ss.input, { width: Math.min(width - 120, 280) }]}
              value={input}
              onChangeText={setInput}
              placeholder="이름 입력..."
              placeholderTextColor="#bbb"
              onSubmitEditing={addPlayer}
              returnKeyType="done"
              maxLength={10}
            />
            <TouchableOpacity onPress={addPlayer} style={ss.addBtn}>
              <Text style={ss.addBtnTxt}>추가</Text>
            </TouchableOpacity>
          </View>

          {/* 플레이어 목록 */}
          <View style={ss.playerList}>
            {players.filter(Boolean).map((p, i) => (
              <View key={i} style={ss.playerChip}>
                <Text style={ss.playerNum}>{i + 1}</Text>
                <Text style={ss.playerName}>{p}</Text>
                <TouchableOpacity onPress={() => removePlayer(i)} style={ss.removeBtn}>
                  <Text style={{ color: '#aaa', fontSize: 16 }}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            {players.filter(Boolean).length < 2 && (
              <Text style={ss.hint}>최소 2명 이상 입력해 주세요</Text>
            )}
          </View>

          {/* 게임 시작 */}
          <TouchableOpacity
            onPress={() => onStart(players.filter(Boolean))}
            disabled={!canStart}
            style={[ss.startBtn, !canStart && { opacity: 0.4 }]}
          >
            <Text style={ss.startBtnTxt}>게임 시작! 🎉</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const ss = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF9F0' },
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 20 },
  titleBox: { alignItems: 'center', marginBottom: 8 },
  logo: { fontSize: 72 },
  title: { fontSize: 38, fontWeight: '900', color: '#FF6B9D', marginTop: 8 },
  sub: { fontSize: 15, color: '#aaa', marginTop: 6 },
  inputRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  input: {
    backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13,
    fontSize: 16, borderWidth: 2, borderColor: '#E0E0E0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  addBtn: { backgroundColor: '#FF6B9D', borderRadius: 14, paddingHorizontal: 18, paddingVertical: 13 },
  addBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 15 },
  playerList: { width: '100%', maxWidth: 360, gap: 8 },
  playerChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
    gap: 12,
  },
  playerNum: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#FF6B9D', color: '#fff',
    fontWeight: '900', fontSize: 14, textAlign: 'center', lineHeight: 28,
  },
  playerName: { flex: 1, fontSize: 16, fontWeight: '700', color: '#333' },
  removeBtn: { padding: 4 },
  hint: { textAlign: 'center', color: '#ccc', fontSize: 13, marginTop: 4 },
  startBtn: {
    backgroundColor: '#FF6B9D', borderRadius: 18, paddingVertical: 18, paddingHorizontal: 48, marginTop: 8,
    shadowColor: '#FF6B9D', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  startBtnTxt: { color: '#fff', fontSize: 20, fontWeight: '900' },
});

/* ════════════════════════════════════
   메인 게임 앱
════════════════════════════════════ */
export default function App() {
  const [players, setPlayers]         = useState(null); // null = 설정 화면
  const [turnIdx, setTurnIdx]         = useState(0);
  const [deck, setDeck]               = useState(buildDeck());
  const [drawnCount, setDrawnCount]   = useState(0);
  const [kingsDrawn, setKingsDrawn]   = useState(0);
  const [lastKingPlayer, setLastKingPlayer] = useState('');
  const [currentCard, setCurrentCard] = useState(null);
  const [showModal, setShowModal]     = useState(false);
  const [showRules, setShowRules]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const { width, height } = useWindowDimensions();
  const isSmall = height < 680;
  const CARD_W  = Math.min(Math.floor((width - 100) / 2), 155);
  const CARD_H  = Math.floor(CARD_W * 1.45);
  const BIG_W   = Math.min(Math.floor(width * 0.42), 170);
  const BIG_H   = Math.floor(BIG_W * 1.45);

  /* 게임 시작 */
  const startGame = (names) => {
    setPlayers(names);
    setTurnIdx(0);
    setDeck(buildDeck());
    setDrawnCount(0);
    setKingsDrawn(0);
    setCurrentCard(null);
    setLastKingPlayer('');
  };

  /* 설정 화면 */
  if (!players) return <SetupScreen onStart={startGame} />;

  const remaining    = deck.length;
  const fanCards     = deck.slice(0, Math.min(8, remaining));
  const currentName  = players[turnIdx % players.length];
  const rule         = currentCard ? RULES[currentCard.rank] : null;

  const drawCard = () => {
    if (remaining === 0) return;
    const [card, ...rest] = deck;
    setDeck(rest);
    setCurrentCard(card);
    setDrawnCount(p => p + 1);

    let newKings = kingsDrawn;
    if (card.rank === 'K') {
      newKings = kingsDrawn + 1;
      setKingsDrawn(newKings);
      if (newKings === 4) setLastKingPlayer(currentName);
    }

    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }).start();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTurnIdx(i => i + 1);
  };

  const doReset = () => {
    setPlayers(null); // 설정 화면으로 돌아가기
    setShowConfirm(false);
  };

  const isLastKing = currentCard?.rank === 'K' && kingsDrawn === 4;
  const btnPad = isSmall ? 12 : 16;

  return (
    <SafeAreaView style={[g.root, Platform.OS === 'web' && { height: '100vh' }]}>

      {/* ── 헤더 ── */}
      <View style={[g.header, { paddingVertical: isSmall ? 8 : 13 }]}>
        <Text style={[g.headerTitle, isSmall && { fontSize: 20 }]}>🐱 솜솜이 킹스컵</Text>
        <TouchableOpacity onPress={() => setShowRules(true)} style={g.rulesBtn}>
          <Text style={g.rulesBtnTxt}>룰북 📋</Text>
        </TouchableOpacity>
      </View>

      {/* ── 현재 플레이어 턴 배너 ── */}
      <View style={[g.turnBanner, { marginTop: isSmall ? 8 : 10 }]}>
        <Text style={g.turnLabel}>지금 차례</Text>
        <Text style={g.turnName}>{currentName} 🎲</Text>
        <Text style={g.turnOrder}>
          {players.map((p, i) => (
            <Text key={i} style={i === turnIdx % players.length ? g.turnActive : g.turnInactive}>
              {i > 0 ? '  →  ' : ''}{p}
            </Text>
          ))}
        </Text>
      </View>

      {/* ── 통계 ── */}
      <View style={[g.statsRow, { marginTop: isSmall ? 6 : 8, paddingVertical: isSmall ? 7 : 10 }]}>
        <View style={g.statItem}>
          <Text style={[g.statNum, { color: '#FF6B9D' }]}>{remaining}</Text>
          <Text style={g.statLabel}>남은 카드</Text>
        </View>
        <View style={g.statDivider} />
        <View style={g.statItem}>
          <Text style={[g.statNum, { color: '#E17055' }]}>{drawnCount}</Text>
          <Text style={g.statLabel}>뽑은 카드</Text>
        </View>
        <View style={g.statDivider} />
        <View style={g.statItem}>
          <View style={{ flexDirection: 'row', gap: 3 }}>
            {[0,1,2,3].map(i => (
              <Text key={i} style={{ fontSize: isSmall ? 14 : 17 }}>{i < kingsDrawn ? '👑' : '🔲'}</Text>
            ))}
          </View>
          <Text style={g.statLabel}>킹스컵</Text>
        </View>
      </View>

      {/* ── 덱 + 마지막 카드 ── */}
      <View style={g.deckRow}>
        {/* 덱 팬 */}
        <View style={g.deckCol}>
          <Text style={g.colLabel}>덱</Text>
          {remaining === 0 ? (
            <View style={{ width: CARD_W + 44, height: CARD_H, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 48 }}>🐱</Text>
              <Text style={{ fontSize: 12, color: '#aaa', marginTop: 8 }}>카드 없음!</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={drawCard}
              activeOpacity={0.82}
              style={{ width: CARD_W + 44, height: CARD_H + 44, justifyContent: 'center', alignItems: 'center' }}
            >
              {fanCards.map((_, i) => {
                const n = fanCards.length, spread = Math.min(n - 1, 6);
                const pct = spread > 0 ? i / spread : 0.5;
                const angle = (pct - 0.5) * 26;
                const tx    = (pct - 0.5) * 16;
                const ty    = Math.abs(angle) * 0.22;
                return (
                  <CardBack key={i} cw={CARD_W} ch={CARD_H} style={{
                    position: 'absolute',
                    transform: [{ rotate: `${angle}deg` }, { translateX: tx }, { translateY: ty }],
                    zIndex: i,
                  }} />
                );
              })}
            </TouchableOpacity>
          )}
          {remaining > 0 && <Text style={g.colHint}>탭해서 뽑기 👆</Text>}
        </View>

        <View style={{ width: 1, height: CARD_H * 0.8, backgroundColor: '#E8E8E8', alignSelf: 'center' }} />

        {/* 마지막 카드 */}
        <View style={g.deckCol}>
          <Text style={g.colLabel}>마지막 카드</Text>
          {currentCard ? (
            <TouchableOpacity onPress={() => setShowModal(true)} activeOpacity={0.82}>
              <CardFace card={currentCard} cw={CARD_W} ch={CARD_H} />
            </TouchableOpacity>
          ) : (
            <View style={[g.emptyCard, { width: CARD_W, height: CARD_H }]}>
              <Text style={{ fontSize: 32, opacity: 0.2 }}>🃏</Text>
            </View>
          )}
          {currentCard && <Text style={g.colHint}>탭해서 다시보기</Text>}
        </View>
      </View>

      {/* ── 버튼 ── */}
      <View style={g.btnRow}>
        <TouchableOpacity
          onPress={drawCard}
          disabled={remaining === 0}
          style={[g.drawBtn, { paddingVertical: btnPad }, remaining === 0 && { backgroundColor: '#ccc', shadowOpacity: 0 }]}
        >
          <Text style={g.drawBtnTxt}>{remaining === 0 ? '카드 없음 🐱' : `🃏  ${currentName} 차례!`}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowConfirm(true)} style={[g.resetBtn, { paddingVertical: btnPad }]}>
          <Text style={{ fontSize: 20 }}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* ════ 카드 결과 모달 ════ */}
      <Modal visible={showModal} transparent animationType="none" onRequestClose={closeModal}>
        <TouchableOpacity style={g.modalOverlay} activeOpacity={1} onPress={closeModal}>
          <Animated.View style={[g.modalBox, { width: Math.min(width - 40, 360), transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              {rule && currentCard && (
                <>
                  {/* 큰 카드 */}
                  <View style={[g.modalCardArea, { backgroundColor: rule.bg, borderBottomColor: rule.color }]}>
                    <CardFace card={currentCard} cw={BIG_W} ch={BIG_H} />
                  </View>

                  <View style={g.modalBody}>
                    <Text style={[g.modalTitle, { color: rule.color }]}>{rule.title}</Text>
                    <Text style={g.modalRule}>{rule.rule}</Text>
                    <View style={[g.tipBox, { backgroundColor: rule.bg, borderLeftColor: rule.color }]}>
                      <Text style={[g.tipTxt, { color: rule.color }]}>💡 {rule.tip}</Text>
                    </View>

                    {/* 킹 알림 */}
                    {currentCard.rank === 'K' && (
                      <View style={[g.kingBadge, { backgroundColor: rule.color }]}>
                        <Text style={g.kingBadgeTxt}>
                          {isLastKing
                            ? `💀 ${lastKingPlayer}냥!! 킹스컵 원샷이다냥!!!`
                            : `👑 ${kingsDrawn} / 4번째 킹이냥~`}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={g.modalFooter}>
                    <TouchableOpacity onPress={closeModal} style={[g.confirmBtn, { backgroundColor: rule.color }]}>
                      <Text style={g.confirmBtnTxt}>확인 👍</Text>
                    </TouchableOpacity>
                    <Text style={g.tapHint}>화면 어디든 탭해도 닫혀요</Text>
                  </View>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* ════ 새 게임 확인 ════ */}
      <Modal visible={showConfirm} transparent animationType="fade" onRequestClose={() => setShowConfirm(false)}>
        <View style={g.confirmOverlay}>
          <View style={[g.confirmBox, { width: Math.min(width - 60, 300) }]}>
            <Text style={{ fontSize: 52, marginBottom: 12 }}>🔄</Text>
            <Text style={g.confirmTitle}>새 게임 시작?</Text>
            <Text style={g.confirmDesc}>플레이어 설정으로 돌아가요.{'\n'}정말 새 게임 할까요?</Text>
            <View style={g.confirmBtnRow}>
              <TouchableOpacity onPress={() => setShowConfirm(false)} style={g.cancelBtn}>
                <Text style={g.cancelBtnTxt}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={doReset} style={g.okBtn}>
                <Text style={g.okBtnTxt}>새 게임!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ════ 룰북 ════ */}
      <Modal visible={showRules} transparent animationType="slide" onRequestClose={() => setShowRules(false)}>
        <View style={g.rulesOverlay}>
          <View style={[g.rulesSheet, { maxHeight: height * 0.85 }]}>
            <View style={g.rulesHeader}>
              <Text style={g.rulesTitle}>🐾 킹스컵 룰북</Text>
              <TouchableOpacity onPress={() => setShowRules(false)} style={g.rulesCloseBtn}>
                <Text style={{ fontSize: 16, color: '#666' }}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {RANKS.map(r => {
                const rl = RULES[r];
                return (
                  <View key={r} style={g.ruleRow}>
                    <View style={[g.ruleBadge, { backgroundColor: rl.color }]}>
                      <Text style={g.ruleBadgeTxt}>{r}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={g.ruleRowTitle}>{rl.title}</Text>
                      <Text style={g.ruleRowBody}>{rl.rule}</Text>
                    </View>
                  </View>
                );
              })}
              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

/* ── 게임 스타일 ── */
const g = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF9F0' },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FF6B9D',
    borderBottomLeftRadius: 22, borderBottomRightRadius: 22,
    shadowColor: '#FF6B9D', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 7,
  },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff' },
  rulesBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 13, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)',
  },
  rulesBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },

  turnBanner: {
    marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 16,
    paddingVertical: 10, paddingHorizontal: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3,
    alignItems: 'center',
  },
  turnLabel: { fontSize: 11, color: '#aaa', marginBottom: 2 },
  turnName: { fontSize: 20, fontWeight: '900', color: '#FF6B9D' },
  turnOrder: { fontSize: 11, marginTop: 4, flexWrap: 'wrap', textAlign: 'center' },
  turnActive: { color: '#FF6B9D', fontWeight: '900' },
  turnInactive: { color: '#ccc' },

  statsRow: {
    flexDirection: 'row', marginHorizontal: 16,
    backgroundColor: '#fff', borderRadius: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '900' },
  statLabel: { fontSize: 10, color: '#bbb', marginTop: 1 },
  statDivider: { width: 1, backgroundColor: '#F0F0F0', marginVertical: 8 },

  deckRow: {
    flex: 1, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-evenly',
    paddingHorizontal: 8, marginTop: 4,
  },
  deckCol: { alignItems: 'center' },
  colLabel: { fontSize: 11, color: '#bbb', marginBottom: 6, fontWeight: '600' },
  colHint: { fontSize: 10, color: '#ccc', marginTop: 5 },
  emptyCard: {
    borderRadius: 14, borderWidth: 2, borderColor: '#E8E8E8', borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA',
  },

  btnRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 16, gap: 10, marginTop: 6 },
  drawBtn: {
    flex: 1, backgroundColor: '#FF6B9D', borderRadius: 18, alignItems: 'center',
    shadowColor: '#FF6B9D', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 7,
  },
  drawBtnTxt: { color: '#fff', fontSize: 17, fontWeight: '900' },
  resetBtn: {
    backgroundColor: '#fff', borderRadius: 18, paddingHorizontal: 18,
    borderWidth: 2, borderColor: '#FF6B6B', alignItems: 'center', justifyContent: 'center',
  },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center' },
  modalBox: {
    backgroundColor: '#fff', borderRadius: 28, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.4, shadowRadius: 30, elevation: 20,
  },
  modalCardArea: { paddingVertical: 24, alignItems: 'center', borderBottomWidth: 3 },
  modalBody: { paddingHorizontal: 22, paddingTop: 18 },
  modalTitle: { fontSize: 21, fontWeight: '900', textAlign: 'center', marginBottom: 10 },
  modalRule: { fontSize: 15, color: '#333', lineHeight: 23, textAlign: 'center', marginBottom: 12 },
  tipBox: { borderRadius: 12, padding: 11, borderLeftWidth: 4 },
  tipTxt: { fontSize: 13, lineHeight: 20, fontWeight: '600' },
  kingBadge: { borderRadius: 12, padding: 12, marginTop: 10, alignItems: 'center' },
  kingBadgeTxt: { color: '#fff', fontWeight: '900', fontSize: 15, textAlign: 'center' },
  modalFooter: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 18 },
  confirmBtn: { paddingVertical: 15, borderRadius: 16, alignItems: 'center' },
  confirmBtnTxt: { color: '#fff', fontWeight: '900', fontSize: 17 },
  tapHint: { textAlign: 'center', color: '#ccc', fontSize: 11, marginTop: 8 },

  confirmOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', alignItems: 'center' },
  confirmBox: {
    backgroundColor: '#fff', borderRadius: 28, padding: 28, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.25, shadowRadius: 24, elevation: 14,
  },
  confirmTitle: { fontSize: 20, fontWeight: '900', color: '#333', marginBottom: 8 },
  confirmDesc: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  confirmBtnRow: { flexDirection: 'row', gap: 10, width: '100%' },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center', borderWidth: 2, borderColor: '#E0E0E0' },
  cancelBtnTxt: { fontWeight: '700', color: '#666', fontSize: 15 },
  okBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center', backgroundColor: '#FF6B6B' },
  okBtnTxt: { fontWeight: '900', color: '#fff', fontSize: 15 },

  rulesOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  rulesSheet: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: 8 },
  rulesHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  rulesTitle: { fontSize: 19, fontWeight: '900', color: '#FF6B9D' },
  rulesCloseBtn: { backgroundColor: '#F5F5F5', borderRadius: 20, width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  ruleRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#F7F7F7', gap: 14 },
  ruleBadge: { width: 46, height: 46, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  ruleBadgeTxt: { fontSize: 17, fontWeight: '900', color: '#fff' },
  ruleRowTitle: { fontSize: 14, fontWeight: '800', color: '#333', marginBottom: 3 },
  ruleRowBody: { fontSize: 12, color: '#999', lineHeight: 17 },
});
