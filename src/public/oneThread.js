const { searchMessages, showAllRows } = require("./search");

// 検索ボタン
const searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", () => {
  const searchInput = document.getElementById("search");
  searchMessages(searchInput.value.toUpperCase());
});

// 検索解除ボタン
const showAllButton = document.getElementById("show-all-button");

showAllButton.addEventListener("click", () => {
  showAllRows();
});

// リプライボタン
const messages = document.getElementsByClassName("message-row");

// 全てのメッセージのリプライボタンにイベントを追加する
Array.from(messages).forEach((element) => {
  // リプライボタン要素の取得
  const buttonElement = element
    .getElementsByClassName("operations")[0]
    .getElementsByClassName("reply-button")[0];
  // リプライボタンがない(メッセージが1つもない)場合は何もしない
  if (!buttonElement) {
    return;
  }

  // element自身が持つメッセージの ID を取得する
  const replyId = parseInt(
    element.getElementsByClassName("message-id")[0].textContent,
    10
  );
  // リプライボタンのクリックイベントを追加し、リプライフォームにリプライ先のメッセージIDを登録する
  buttonElement.addEventListener("click", () => {
    const replyText = document.getElementsByClassName("reply-text")[0];
    replyText.textContent = replyId;
    const replyInput = document.getElementById("replyId");
    replyInput.value = replyId;
  });
});

// リプライ解除ボタン
const cancelButton = document.getElementById("cancel-reply");

cancelButton.addEventListener("click", () => {
  const replyText = document.getElementsByClassName("reply-text")[0];
  replyText.textContent = "指定されていません";
  const replyInput = document.getElementById("replyId");
  replyInput.value = "0";
});
