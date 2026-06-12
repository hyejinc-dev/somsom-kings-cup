# 🐱 솜솜이 킹스컵

솜솜이가 직접 진행하는 킹스컵 카드 게임이다냥! 🐾

## 🎮 게임 소개

솜솜이 킹스컵은 React Native(Expo)로 만든 모바일 카드 게임이다냥~
귀여운 솜솜이 사진이 카드 배경으로 들어가있다냥! 😸

플레이어 이름을 입력하고, 카드를 뽑고, 솜솜이의 명령에 따르면 된다냥!

## 📱 실행 방법

### Expo Go로 바로 실행 (아이폰/안드로이드)

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npx expo start
```

QR 코드를 Expo Go 앱으로 스캔하면 된다냥~
- iOS: App Store에서 **Expo Go** 설치
- Android: Play Store에서 **Expo Go** 설치

### 웹 브라우저로 실행

```bash
CI=1 npx expo start --web --port 8082 --clear
```

### Android APK 빌드

```bash
npx eas-cli build --platform android --profile preview --non-interactive
```

## 🃏 카드 룰

| 카드 | 룰 |
|------|-----|
| A | 다같이 마셔라냥! |
| 2 | 지목이다냥! |
| 3 | 내가 마신다냥! |
| 4 | 여자만 마셔라냥! |
| 5 | 게임 오브 데스다냥! |
| 6 | 남자만 마셔라냥! |
| 7 | Seven Heaven이다냥! |
| 8 | 짝꿍 정하라냥! |
| 9 | 초성 게임이다냥! |
| 10 | 카테고리다냥! |
| J | 룰 메이커다냥! |
| Q | 퀘스천 마스터다냥! |
| K | 👑 킹스컵이다냥!!! |

## 🛠 기술 스택

- **React Native** (Expo SDK 52)
- **EAS Build** — 클라우드 APK 빌드
- **expo-asset** ~11.0.5

## 🐾 솜솜이란?

이 게임의 마스코트이자 진짜 고양이다냥~
솜솜이 사진 8장이 카드 배경으로 들어가있다냥! 🐱

---

*솜솜이가 지켜보고 있다냥... 규칙 어기면 안 된다냥! 😾*
