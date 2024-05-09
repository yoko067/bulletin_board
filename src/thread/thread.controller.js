"use strict";

const PromiseRouter = require("express-promise-router");
const express = require("express");
const path = require("path");
const { loginRouter } = require("../login/login.controller");

const {
  getAllThreads,
  createThread,
  getThreadName,
  deleteThread,
  getAllMessages,
  createMessage,
  deleteMessage
} = require("./thread.service");

const app = express();
const threadRouter = PromiseRouter();
// loginRouterはセッション情報を共有するために使用
app.use(loginRouter);
threadRouter.use(express.static(path.resolve(__dirname, "public")));

/* ----- スレッド表示に関する処理 ----- */
// スレッド追加・削除画面の表示
threadRouter.get("/", async (req, res) => {
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

// スレッド追加処理
threadRouter.post("/", async (req, res) => {
  if (req.user) {
    createThread(req.body.title);
    res.redirect("/thread");
  } else {
    res.redirect("../");
  }
});

// スレッド削除処理
threadRouter.delete("/:threadId", async (req, res) => {
  if (req.user.username === "admin") {
    deleteThread(parseInt(req.params.threadId, 10));
    res.redirect("/thread");
  } else {
    res.redirect("../../");
  }
});

/* ----- メッセージ表示に関する処理 ----- */
// メッセージ追加・削除画面の表示
threadRouter.get("/:threadId", async (req, res) => {
  if (req.user) {
    const messages = await getAllMessages(req.params.threadId);
    const threadName = await getThreadName(req.params.threadId);

    if (req.user.username === "admin") {
      res.render("adminOneThread", { messages, threadId: req.params.threadId });
    } else {
      res.render("oneThread", {
        messages,
        threadName,
        threadId: req.params.threadId
      });
    }
  } else {
    res.redirect("../../");
  }
});

// メッセージ追加処理
threadRouter.post("/:threadId", async (req, res) => {
  if (req.user) {
    const replyId = req.body.replyId;
    console.log(replyId);
    createMessage(req.params.threadId, req.body.content, replyId);
    res.redirect(`/thread/${req.params.threadId}`);
  } else {
    res.redirect("../../");
  }
});

// メッセージ削除処理
threadRouter.delete("/:threadId/:msgId", async (req, res) => {
  if (req.user) {
    if (req.user.username === "admin") {
      deleteMessage(
        parseInt(req.params.threadId, 10),
        parseInt(req.params.msgId, 10)
      );
    }
    res.redirect(`/thread/${req.params.threadId}`);
  } else {
    res.redirect("../../");
  }
});

module.exports = {
  threadRouter
};
