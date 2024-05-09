"use strict";
const path = require("path");
const PromiseRouter = require("express-promise-router");
const express = require("express");
const methodOverride = require("method-override");
const { threadRouter } = require("./thread/thread.controller");
const { loginRouter } = require("./login/login.controller");
const { getAllThreads } = require("./thread/thread.service");

const app = express();
// テンプレートエンジンに EJS を使うようにする設定
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

// クエリパラメータの _method キーの値でリクエストメソッドを上書きする
// 例： /messages?_method=DELETE で DELETE リクエストを受け付ける
app.use(methodOverride("_method"));
// リクエストボディをパースする
app.use(express.urlencoded({ extended: true }));

// "/" パスにアクセス時に login.ejs を表示
app.get("/", (req, res) => {
  res.redirect("/login-app");
});

// 静的ファイルを提供する
app.use(express.static(path.resolve(__dirname, "public")));

// セッション情報を共有
app.use(loginRouter);
const router = PromiseRouter();
app.use(router);

// "/thread"を呼び出したとき
router.get("/thread", async (req, res) => {
  // セッションにユーザデータが存在するかを確認して掲示板を返すかを決める (デシリアライズされたデータがreq.userに保存されている。)
  if (req.user) {
    const threads = await getAllThreads();
    if (req.user.username === "admin") {
      res.render("adminAllThreads", { threads });
    } else {
      res.render("allThreads", { threads });
    }
  } else {
    res.redirect("../");
  }
});

// "/login-app"を呼び出したとき
router.get("/login-app", async (req, res) => {
  res.render("login");
});

// リクエストのルーティング: 第一引数より後のパスは第二引数のルーターが担当(第一引数のルーティングはrouterが担当)
app.use("/thread", threadRouter);
app.use("/login-app", loginRouter);

module.exports = app;
