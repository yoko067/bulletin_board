"use strict";

const Threads = require("../database/models").Threads;
const Messages = require("../database/models").Messages;
const getAllThreads = async () => {
  const db = await Threads.findAll();
  return db;
};

const createThread = async (title) => {
  Threads.create({
    title
  });
  console.log(`スレッド「${title}」を作成しました`);
};

const getThreadName = async (threadId) => {
  const thread = await Threads.findOne({
    where: { threadId }
  });

  return thread.title;
};

const deleteThread = async (threadId) => {
  const selectedThread = await Threads.findOne({
    where: { threadId }
  });
  await selectedThread.destroy();

  console.log(`スレッド「${threadId}」を削除しました`);
};

const getAllMessages = async (threadId) => {
  const messages = await Messages.findAll({
    where: { threadId }
  });
  return messages;
};

const createMessage = async (threadId, content, replyId) => {
  const currentDateTime = new Date();
  const count = await Messages.count({
    where: { threadId }
  });
  await Messages.create({
    msgNum: count + 1,
    content,
    dateTime: currentDateTime,
    replyId,
    deleted: false,
    threadId
  });
};

const deleteMessage = async (threadId, msgId) => {
  const selectedMsg = await Messages.findOne({
    where: { threadId, msgId }
  });
  selectedMsg.deleted = true;
  await selectedMsg.save();
};

module.exports = {
  getAllThreads,
  createThread,
  getThreadName,
  deleteThread,
  getAllMessages,
  createMessage,
  deleteMessage
};
