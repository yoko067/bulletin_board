"use strict";

const { settingStrategy, settingSession } = require("./local.pass.js");
const users = require("../database/models").Users;

// ユーザー認証関数
const authUser = async (passport, req, res) => {
  // local.passで作成したストラテジー(認証方法)を呼び出す。
  await settingStrategy(passport, users);
  // local.passで作成したセッションに入れるデータの定義情報を呼び出す。
  await settingSession(passport, users);
  // ストラテジーを使って認証し、ユーザデータをセッションにデータを保存する。
  passport.authenticate("local", {
    successRedirect: "/thread", // 認証成功 → 掲示板に移動
    failureRedirect: "/", // 認証失敗 → ログイン画面へ移動
    session: true // セッションを認証で使うかを決定
  })(req, res);
};

// ユーザー登録関数
const registerUser = async (username, password, err) => {
  // ユーザーモデルを使用してデータベースに新しいユーザーを作成
  await users.findOrCreate({
    where: { username },
    defaults: {
      username,
      password
    }
  });
  const user = await users.findAll();
  console.log(user);
};
// 関数をエクスポート
module.exports = {
  registerUser,
  authUser
};
