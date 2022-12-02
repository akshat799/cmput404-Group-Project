import React from 'react';
import Navbar from '../../components/Navbar';
import angela from './assets/images/avatar-angela-gray.webp';
import anna from './assets/images/avatar-anna-kim.webp';
import jacob from './assets/images/avatar-jacob-thompson.webp';
import kimberly from './assets/images/avatar-kimberly-smith.webp';
import mark from './assets/images/avatar-mark-webber.webp';
import nathan from './assets/images/avatar-nathan-peterson.webp';
import rizky from './assets/images/avatar-rizky-hasanuddin.webp';
import chess from './assets/images/image-chess.webp';
import './Inbox.css';
const Inbox = () => {
    React.useEffect(() => {
        document.body.style.backgroundColor = "#DADADA";
    }, []);
    const markAllRead = () => {
        const unreadMessages = document.querySelectorAll(".unread");
        const unread = document.getElementById("notifes");
        unread.innerText = unreadMessages.length;
        unreadMessages.forEach(message => message.classList.remove("unread"));
        const newUnreadMessages = document.querySelectorAll(".unread");
        unread.innerText = newUnreadMessages.length;
    };
    const seenMessage = (e) => {
        console.log(e.currentTarget);
        const unreadMessages = document.querySelectorAll(".unread");
        const unread = document.getElementById("notifes");
        const markAll = document.getElementById("mark_all");
        unread.innerText = unreadMessages.length;
        e.currentTarget.classList.remove("unread");
        const newUnreadMessages = document.querySelectorAll(".unread");
        unread.innerText = newUnreadMessages.length;


    };

    return (
        <>
            <Navbar />
            <div class="notiContainer">
                <header>
                    <div class="notif_box">
                        <h1 class="title">Notifications</h1>
                        <span id="notifes">3</span>
                    </div>
                    <p id="mark_all" onClick={markAllRead}>Mark all as read</p>
                </header>
                <main>
                    <div class="notif_card unread" onClick={(e) => seenMessage(e)}>
                        <img src={mark} alt="avatar" />
                        <div class="description">
                            <p class="user_activity">
                                <strong>Mark Webber</strong> reacted to your recent post
                                <b>My first tournament today!</b>
                            </p>
                            <p class="time">1m ago</p>
                        </div>
                    </div>
                    <div class="notif_card unread" onClick={(e) => seenMessage(e)}>
                        <img src={angela} alt="avatar" />
                        <div class="description">
                            <p class="user_activity">
                                <strong>Angela Gray</strong> followed you
                            </p>
                            <p class="time">5m ago</p>
                        </div>
                    </div>
                    <div class="notif_card unread" onClick={(e) => seenMessage(e)}>
                        <img src={jacob} alt="avatar" />
                        <div class="description">
                            <p class="user_activity">
                                <strong>Jacob Thompson</strong> has joined your group
                                <strong class="link">Chess Club</strong>
                            </p>
                            <p class="time">1 day ago</p>
                        </div>
                    </div>
                    <div>
                        <div class="notif_card">
                            <div class="message_card">
                                <img
                                    src={rizky}
                                    alt="avatar"
                                />
                                <div class="description">
                                    <p class="user_activity">
                                        <strong>Rizky Hasanuddin</strong> sent you a private message
                                    </p>
                                    <p class="time">5 days ago</p>
                                </div>
                            </div>
                        </div>
                        <div class="message">
                            <p>
                                Hello, thanks for setting up the Chess Club. I've been a member
                                for a few weeks now and I'm already having lots of fun and
                                improving my game.
                            </p>
                        </div>
                    </div>

                    <div class="notif_card">
                        <img src={kimberly} alt="avatar" />
                        <div class="description">
                            <p class="user_activity">
                                <strong>Kimberly Smith</strong> commented on your picture
                            </p>
                            <p class="time">1 week ago</p>
                        </div>
                        <img src={chess} class="chess_img" alt="chess" />
                    </div>
                    <div class="notif_card">
                        <img src={nathan} alt="avatar" />
                        <div class="description">
                            <p class="user_activity">
                                <strong>Nathan Pererson</strong> reacted to your recent post
                                <b>5 end-game strategies to increase your win rate</b>
                            </p>
                            <p class="time">2 weeks ago</p>
                        </div>
                    </div>
                    <div class="notif_card">
                        <img src={anna} alt="avatar" />
                        <div class="description">
                            <p class="user_activity">
                                <strong>Anna Kim</strong> left the group
                                <strong class="link">Chess Club</strong>
                            </p>
                            <p class="time">2 weeks ago</p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Inbox;