import React, {useCallback, useRef} from "react";
import Messages from "@src/components/messenger/messages";
import AddMessagesForm from "@src/components/messenger/add-messages-form";
import Message from "@src/components/messenger/message";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import { useEffect, useLayoutEffect } from "react";
import Spinner from "@src/components/elements/spinner";

function Chat() {
  const store = useStore();
  // Ссылка на блок с сообщениями
  const chatBox = useRef();

  const select = useSelector(state => ({
    token: state.session.token,
    user: state.session.user,
    messages: state.chat.messages,
    waiting: state.chat.waiting,
    maxMessages: state.chat.maxMessages
  }))

  // Инициализация чата
  useEffect(() => {
    store.get('chat').init(select.token);
    return () => store.get('chat').shutdown(); 
  }, []);

  // Запуск наблюдателя (Наблюдение происходит на последнем элементе)
  useEffect(() => {
    // if(select.messages.length <= 10 || (chatBox.current.scrollHeight - chatBox.current.scrollTop) <= 675) {
    //   chatBox.current.scrollTop = chatBox.current.scrollHeight;
    // }

    const option = {
      root: null,
      rootMargin: "60px",
      threshold: 0.5
    };
    // Инициализация наблюдателя
    const observer = new IntersectionObserver(callbacks.handleObserver, option);
    if (chatBox.current.childNodes[select.messages.length - 1]) observer.observe(chatBox.current.childNodes[select.messages.length - 1]);
    return () => {
      if (chatBox.current?.childNodes[select.messages.length - 1]) {
        observer.unobserve(chatBox.current.childNodes[select.messages.length - 1]);
        observer.disconnect();
      }
    }
  }, [select.messages]);

  const callbacks = {
    // Отправка сообщения
    submitMessage: useCallback((text) => {
      // вызываем метод на отправку сообщения
      store.get('chat').postMessage(text, select.user);
      // после ползунок скрола опускаем
      chatBox.current.scrollTop = 0;
    }, []),

    // Наблюдатель
    handleObserver: useCallback((entries) =>{
      const target = entries[0];
      if(target.isIntersecting && !select.waiting && !select.maxMessages){
        // запрос на получение старых сообщений
        store.get('chat').oldMessage();
      }
    }, [select.waiting, select.maxMessages, store.get('chat').oldMessage])
  }

  // Рендер функция
  const renders = {
    message: useCallback(item => (
      <Message item={item} key={item._id} userId={select.user._id}/>
    ), [])
  }

  return(
    <>
      <Messages 
        messages={select.messages}
        renderMessage={renders.message} 
        chatBoxRef={chatBox} 
        waiting={select.waiting}/>
      <AddMessagesForm submitMessage={callbacks.submitMessage}/>
    </>
  );
}

export default React.memo(Chat);