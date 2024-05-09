"use strict";

const PromiseRouter = require("express-promise-router");
const express = require("express");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const { registerUser, authUser } = require("./login.service");
const loginRouter = PromiseRouter();

const app = express();
loginRouter.use(express.static(path.resolve(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// cookieに保存する保存時間などのセッション情報をどのような形式で保存するかを定義
loginRouter.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxage: 1000 * 60 * 60 // 1000ms * 60 * 60 -> 60分間
    }
  })
);

// passportを初期化
loginRouter.use(passport.initialize());
// ページが更新するたびにデシリアライズを呼び出すようにする。
loginRouter.use(passport.session());

// ログイン画面を表示
loginRouter.get("/", (req, res) => {
  res.redirect("/");
});

// "/register" パスにアクセス時に register.ejs を表示
loginRouter.get("/register", (req, res) => {
  res.render("register");
});

// ユーザー認証(初回: 二回目以降はセッション情報を使って認証を行う → app.jsでreq.userを用いて行う)
loginRouter.post("/login", async (req, res) => {
  // serviceのauthUserを呼び出して、認証を行い、認証後のユーザデータをセッションに保存する
  await authUser(passport, req, res);
});

// ログアウト
loginRouter.post("/logout", async (req, res) => {
  req.session.passport.user = undefined;
  res.redirect("../");
});

// ユーザー登録
loginRouter.post("/register", async (req, res) => {
  await registerUser(req.body.username, req.body.password);
  res.redirect("/");
});

module.exports = {
  loginRouter
};
