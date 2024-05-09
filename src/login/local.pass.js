"use strict";

const LocalStrategy = require("passport-local");

// passport.jsの認証ストラテジーを定義
const settingStrategy = (passport, users) => {
  passport.use(
    new LocalStrategy(async function (username, password, done) {
      const user = await users.findOne({
        where: { username }
      });
      // 受け取ったユーザーデータをデータベースの情報と比較
      if (!user) {
        return done(null, false, {
          message: "ユーザーIDが正しくありません。"
        });
      } else if (user.password !== password) {
        return done(null, false, {
          message: "パスワードが正しくありません。"
        });
      } else {
        return done(null, user);
      }
    })
  );
};

// セッション情報の保存の仕方や取り出し方を定義
const settingSession = (passport, users) => {
  // シリアライズ設定(初めて認証を行った際にシリアライズしたユーザデータをセッションに保存する)
  passport.serializeUser((user, done) => {
    done(null, user.username);
    console.log("シリアライズ中...");
  });

  // デシリアライズ設定(セッションからシリアライズされたユーザデータを復元してリクエスト(req.user)に保存する)
  passport.deserializeUser(async (username, done) => {
    console.log("デシリアライズ中...");
    const user = await users.findOne({
      where: { username }
    });
    done(null, user);
  });
};

module.exports = {
  settingStrategy,
  settingSession
};
