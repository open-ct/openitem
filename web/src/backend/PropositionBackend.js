import * as Setting from "../Setting";

export function TraceQuestionVersion(qid) {
  return fetch(`${Setting.ServerUrl}/api/qbank/question/trace?:qid=${qid}`, {
    method: "GET",
    credentials: "include",
  }).then(res => res.json());
}

export function GetTempQuestionList(id_list) {
  let data = new Object();
  data.id_list = id_list;
  return fetch(`${Setting.ServerUrl}/api/qbank/query/t_question`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(data),
  }).then(res => res.json());
}

export function GetUserTempQuestions(uid) {
  return fetch(`${Setting.ServerUrl}/api/qbank/question/user_t?:uid=${uid}`, {
    method: "GET",
    credentials: "include",
  }).then(res => res.json());
}

export function GetUserTempTestpaper(uid) {
  return fetch(`${Setting.ServerUrl}/api/qbank/testpaper/user_t?:uid=${uid}`, {
    method: "GET",
    credentials: "include",
  }).then(res => res.json());
}

export function CreateNewQuestion(data) {
  let newData = Setting.deepCopy(data);
  return fetch(`${Setting.ServerUrl}/api/qbank/question`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(newData),
  }).then(res => res.json());
}

export function CreateNewTestpaper(data) {
  let newData = Setting.deepCopy(data);
  return fetch(`${Setting.ServerUrl}/api/qbank/testpaper`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(newData),
  }).then(res => res.json());
}
export function DeleteTempTestpaper(tid) {
  return fetch(`${Setting.ServerUrl}/api/qbank/testpaper/temp?:tid=${tid}`, {
    method: "DELETE",
    credentials: "include",
  }).then(res => res.json());
}
