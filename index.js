const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');

// Aapka Bot Token aur Admin Chat ID
const BOT_TOKEN = '8997461473:AAFEdBZNr8KAMGEVAFHEj1BQSx0hD3gdf9c';
const ADMIN_ID = '8153428742';

// Timeout setting ke sath bot initialize kar rahe hain
const bot = new Telegraf(BOT_TOKEN, {
    telegram: { agent: null, timeout: 50000 }
});

// --- USER TRACKING DATABASE SYSTEM ---
const DB_FILE = path.join(__dirname, 'users.json');

// Users load karne ka function
const loadUsers = () => {
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.log('Error reading users db:', err);
    }
    return [];
};

// User save karne ka function
const saveUser = (user) => {
    const users = loadUsers();
    const exists = users.some(u => u.id === user.id);
    if (!exists) {
        users.push({
            id: user.id,
            username: user.username ? `@${user.username}` : 'No Username',
            firstName: user.first_name || 'Unknown',
            date: new Date().toISOString()
        });
        fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
    }
};

// Translations Dictionary (Multi-Language Support)
const langData = {
    en: {
        welcome: "🔥 Welcome to *𝐛𝟒𝐦𝐰𝟑 𝐌𝐚𝐫𝐤𝐞𝐭 𝐡𝐮𝐛*!\n\nTrusted & Fast Service.\nJoin our channel for proofs: t.me/voidxsecurityofficial\n\nSelect an option below to proceed:",
        ccShop: "💳 CC Shop",
        logs: "📂 Logs (PayPal & CashApp)",
        methods: "📦 Methods",
        bins: "🎯 Custom BINs",
        faqs: "❓ FAQs",
        contact: "📞 Contact Owner",
        changeLang: "🌐 Change Language",
        ccTitle: "💳 *Credit Card Shop*\nSelect your desired CC package:",
        logsTitle: "📂 *Logs Section*\nSelect the type of logs you want:",
        methodsText: "📦 *Methods Section*\n\n1. CC to Crypto Method\n2. Custom Cashout Methods\n\nFor buying or custom methods, contact owner directly: @voidxsecurityadmin",
        binsText: "🎯 *Custom BIN Search*\n\nFormat to search country & specific site:\nExample: Type `/bin US Amazon` to check availability.",
        faqsText: "❓ *FAQs & Trust - 𝐛𝟒𝐦𝐰𝟑 𝐌𝐚𝐫𝐤𝐞𝐭 𝐡𝐮𝐛*\n\n• *Q: Is this legit / Do you provide proof?*\n  A: Yes! Check our official proof channel: t.me/voidxsecurityofficial\n\n• *Q: How long does delivery take?*\n  A: Delivery is done manually right after payment verification (usually 2-5 minutes).\n\n• *Q: How to pay?*\n  A: Send crypto to our USDT/BTC address or Binance ID, then send payment screenshot with `/paymentdone`.",
        contactText: "📞 *Direct Support*\n\nClick below to chat with the owner:",
        paymentInfo: "📝 *Payment Details:*\n\n• **USDT (BEP20):** `0x89cd5188f8be20b1358247c8ec1f96cac7b59adf`\n• **BTC Address:** `1NoJZhM7L1WcQZf19FPRzcK7e6D5KD8bds`\n• **Binance ID:** `76585865` (Abdul Aziz)\n\n⚠️ *Note:* After payment, send the screenshot here and reply/caption with `/paymentdone`.",
        paypalDesc: "🛒 You selected: *PayPal Logs ($70)*\n\n📋 *Log Details Included:*\n• Full Email Access 📥\n• Full Name, Address & DOB 📌\n• Gender Info (Male / Female) 👤\n• Much More Full Info Included! 🔥\n\n",
        cashappDesc: "🛒 You selected: *CashApp Logs ($40)*\n\n📋 *Log Details Included:*\n• Active CashApp Access 💵\n• Linked Bank / Card Info 💳\n• Full Profile Details (Name, DOB, etc.) 📌\n• High Quality & Fresh Logs! 🔥\n\n",
        payButton: "✅ I Have Paid",
        sentNotice: "✅ Payment screenshot sent to admin successfully! Please wait while your payment is verified."
    },
    ar: {
        welcome: "🔥 أهلاً بك في *𝐛𝟒𝐦𝐰𝟑 𝐌𝐚𝐫𝐤𝐞𝐭 𝐡𝐮𝐛*!\n\nخدمة موثوقة وسريعة.\nقناة الإثباتات: t.me/voidxsecurityofficial\n\nاختر خياراً أدناه للمتابعة:",
        ccShop: "💳 متجر البطاقات",
        logs: "📂 السجلات (PayPal & CashApp)",
        methods: "📦 الطرق",
        bins: "🎯 بحث BIN مخصص",
        faqs: "❓ الأسئلة الشائعة",
        contact: "📞 اتصل بالمالك",
        changeLang: "🌐 تغيير اللغة",
        ccTitle: "💳 *متجر البطاقات*\nاختر باقة البطاقات التي تريدها:",
        logsTitle: "📂 *قسم السجلات*\nاختر نوع السجلات المطلوبة:",
        methodsText: "📦 *قسم الطرق*\n\nللشراء، تواصل مباشرة مع المالك: @voidxsecurityadmin",
        binsText: "🎯 *بحث BIN مخصص*\nمثال: `/bin US Amazon`",
        faqsText: "❓ *الأسئلة الشائعة والثقة*\nتحقق من قناة الإثباتات: t.me/voidxsecurityofficial",
        contactText: "📞 *الدعم المباشر*\nانقر أدناه للتحدث مع المالك:",
        paymentInfo: "📝 *تفاصيل الدفع:*\n\n• **USDT (BEP20):** `0x89cd5188f8be20b1358247c8ec1f96cac7b59adf`\n• **BTC:** `1NoJZhM7L1WcQZf19FPRzcK7e6D5KD8bds`\n• **Binance ID:** `76585865`\n\n⚠️ أرسل لقطة الشاشة بعد الدفع مع `/paymentdone`.",
        paypalDesc: "🛒 لقد اخترت: *سجلات PayPal ($70)*\n\n",
        cashappDesc: "🛒 لقد اخترت: *سجلات CashApp ($40)*\n\n",
        payButton: "✅ لقد قمت بالدفع",
        sentNotice: "✅ تم إرسال لقطة شاشة الدفع إلى المسؤول بنجاح!"
    },
    ur: {
        welcome: "🔥 *𝐛𝟒𝐦𝐰𝟑 𝐌𝐚𝐫𝐤𝐞𝐭 𝐡𝐮𝐛* mein خوش آمدید!\n\nتوسعت اور تیز سروس۔\nپروف چینل: t.me/voidxsecurityofficial\n\nآگے بڑھنے کے لیے نیچے سے آپشن منتخب کریں:",
        ccShop: "💳 CC شاپ",
        logs: "📂 لاگز (PayPal & CashApp)",
        methods: "📦 میتھڈز",
        bins: "🎯 کسٹم BINs",
        faqs: "❓ سوالات (FAQs)",
        contact: "📞 اونر سے رابطہ کریں",
        changeLang: "🌐 زبان تبدیل کریں",
        ccTitle: "💳 *کریڈت کارڈ شاپ*\nअपना مطلوبہ CC پیکج منتخب کریں:",
        logsTitle: "📂 *لاگز سیکشن*\nاپنے مطلوبہ لاگز منتخب کریں:",
        methodsText: "📦 *میتھڈز سیکشن*\n\nخریدنے کے لیے رابطہ کریں: @voidxsecurityadmin",
        binsText: "🎯 *کسٹم BIN تلاش*\nمثال: `/bin US Amazon`",
        faqsText: "❓ *FAQs اور ٹرسٹ*\nپروف چینل چیک کریں: t.me/voidxsecurityofficial",
        contactText: "📞 *ڈائریکٹ سپورٹ*\nاونر سے بات کرنے کے لیے کلک کریں:",
        paymentInfo: "📝 *پیمنٹ ڈیٹیلز:*\n\n• **USDT (BEP20):** `0x89cd5188f8be20b1358247c8ec1f96cac7b59adf`\n• **BTC:** `1NoJZhM7L1WcQZf19FPRzcK7e6D5KD8bds`\n• **Binance ID:** `76585865`\n\n⚠️ پیمنٹ کے بعد اسکرین شاٹ بھیج کر `/paymentdone` لکھیں۔",
        paypalDesc: "🛒 آپ نے منتخب کیا: *PayPal لاگز ($70)*\n\n",
        cashappDesc: "🛒 آپ نے منتخب کیا: *CashApp لاگز ($40)*\n\n",
        payButton: "✅ میں نے پے کر دیا ہے",
        sentNotice: "✅ پیمنٹ اسکرین شاٹ ایڈمن کو بھیج دیا گیا ہے!"
    }
};

const userLang = {};

const getMainMenu = (lang) => {
    const t = langData[lang] || langData.en;
    return Markup.keyboard([
        [t.ccShop, t.logs],
        [t.methods, t.bins],
        [t.faqs, t.contact],
        [t.changeLang]
    ]).resize();
};

bot.start((ctx) => {
    saveUser(ctx.from);

    ctx.reply(
        `🌍 *Welcome to 𝐛𝟒𝐦𝐰𝟑 𝐌𝐚𝐫𝐤𝐞𝐭 𝐡𝐮𝐛!*\n\nPlease select your preferred language:`,
        {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [Markup.button.callback('🇬🇧 English', 'lang_en'), Markup.button.callback('🇸🇦 العربية', 'lang_ar')],
                [Markup.button.callback('🇵🇰 اردو', 'lang_ur')]
            ])
        }
    );
});

// --- ADMIN COMMAND: /userlist ---
bot.command('userlist', (ctx) => {
    if (String(ctx.from.id) !== String(ADMIN_ID)) {
        return ctx.reply('⚠️ This command is only for the admin!');
    }

    const users = loadUsers();
    if (users.length === 0) {
        return ctx.reply('📂 No users have started the bot yet.');
    }

    let message = `📊 *Total Users List (${users.length}):*\n\n`;
    users.forEach((u, index) => {
        message += `${index + 1}. *Name:* ${u.firstName}\n   *Username:* ${u.username}\n   *ID:* \`${u.id}\`\n\n`;
    });

    if (message.length > 4096) {
        message = message.substring(0, 4090) + '...\n*(List too long)*';
    }

    ctx.reply(message, { parse_mode: 'Markdown' });
});

// --- ADMIN COMMAND: /broadcast ---
bot.command('broadcast', async (ctx) => {
    if (String(ctx.from.id) !== String(ADMIN_ID)) {
        return ctx.reply('⚠️ This command is only for the admin!');
    }

    // Message ka text nikal lo jo /broadcast ke baad likha hoga
    const broadcastText = ctx.message.text.split(' ').slice(1).join(' ');
    if (!broadcastText) {
        return ctx.reply('⚠️ Please provide a message to broadcast.\nExample: `/broadcast Hello everyone, huge discount today!`', { parse_mode: 'Markdown' });
    }

    const users = loadUsers();
    if (users.length === 0) {
        return ctx.reply('📂 No users found to broadcast.');
    }

    let successCount = 0;
    let failCount = 0;

    ctx.reply(`📢 Broadcast started to ${users.length} users. Please wait...`);

    // Saare users ko ek ek karke message bhejna
    for (const user of users) {
        try {
            await bot.telegram.sendMessage(user.id, `📢 *Announcement:*\n\n${broadcastText}`, { parse_mode: 'Markdown' });
            successCount++;
            // Chota sa delay taaki Telegram ki rate limit (flood wait) na lage
            await new Promise(resolve => setTimeout(resolve, 50));
        } catch (err) {
            failCount++;
            console.log(`Failed to send message to ${user.id}:`, err.message);
        }
    }

    ctx.reply(`✅ *Broadcast Completed!*\n\n• Successfully Sent: ${successCount}\n• Failed (Blocked bot): ${failCount}`, { parse_mode: 'Markdown' });
});

bot.action(/lang_(.+)/, (ctx) => {
    const lang = ctx.match[1];
    userLang[ctx.from.id] = lang;
    const t = langData[lang] || langData.en;

    ctx.reply(t.welcome, {
        parse_mode: 'Markdown',
        ...getMainMenu(lang)
    });
});

bot.hears(['🌐 Change Language', '🌐 تغيير اللغة', '🌐 زبان تبدیل کریں'], (ctx) => {
    ctx.reply('🌍 Select your language / اختر لغتك / زبان منتخب کریں:', {
        ...Markup.inlineKeyboard([
            [Markup.button.callback('🇬🇧 English', 'lang_en'), Markup.button.callback('🇸🇦 العربية', 'lang_ar')],
            [Markup.button.callback('🇵🇰 اردو', 'lang_ur')]
        ])
    });
});

bot.hears(/(💳 CC Shop|💳 متجر البطاقات|💳 CC شاپ)/, (ctx) => {
    const lang = userLang[ctx.from.id] || 'en';
    const t = langData[lang];
    ctx.reply(t.ccTitle, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.callback('💎 $15 CC (Est. Bal: $200+)', 'buy_cc_15')],
            [Markup.button.callback('💎 $20 CC (Est. Bal: $350+)', 'buy_cc_20')],
            [Markup.button.callback('💎 $30 CC (Est. Bal: $750+)', 'buy_cc_30')],
            [Markup.button.callback('💎 $40 CC (Est. Bal: $1200+)', 'buy_cc_40')]
        ])
    });
});

bot.hears(/(📂 Logs.*|📂 السجلات.*|📂 لاگز.*)/, (ctx) => {
    const lang = userLang[ctx.from.id] || 'en';
    const t = langData[lang];
    ctx.reply(t.logsTitle, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.callback('💸 PayPal Logs ($70)', 'buy_paypal_logs')],
            [Markup.button.callback('💸 CashApp Logs ($40)', 'buy_cashapp_logs')]
        ])
    });
});

bot.hears(/(📦 Methods|📦 الطرق|📦 میتھڈز)/, (ctx) => {
    const lang = userLang[ctx.from.id] || 'en';
    const t = langData[lang];
    ctx.reply(t.methodsText, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.url('💬 Contact Owner', 'https://t.me/voidxsecurityadmin')]
        ])
    });
});

bot.hears(/(🎯 Custom BINs|🎯 بحث BIN مخصص|🎯 کسٹم BINs)/, (ctx) => {
    const lang = userLang[ctx.from.id] || 'en';
    const t = langData[lang];
    ctx.reply(t.binsText, { parse_mode: 'Markdown' });
});

bot.hears(/(❓ FAQs|❓ الأسئلة الشائعة|❓ سوالات)/, (ctx) => {
    const lang = userLang[ctx.from.id] || 'en';
    const t = langData[lang];
    ctx.reply(t.faqsText, { parse_mode: 'Markdown' });
});

bot.hears(/(📞 Contact Owner|📞 اتصل بالمالك|📞 اونر سے رابطہ کریں)/, (ctx) => {
    const lang = userLang[ctx.from.id] || 'en';
    const t = langData[lang];
    ctx.reply(t.contactText, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.url('👤 Owner Profile', 'https://t.me/voidxsecurityadmin')],
            [Markup.button.url('📢 Proof Channel', 'https://t.me/voidxsecurityofficial')]
        ])
    });
});

bot.action(['buy_cc_15', 'buy_cc_20', 'buy_cc_30', 'buy_cc_40'], (ctx) => {
    const lang = userLang[ctx.from.id] || 'en';
    const t = langData[lang];
    let priceTitle = '';
    if (ctx.match[0] === 'buy_cc_15') priceTitle = '$15 CC (Est. Bal: $200+)';
    if (ctx.match[0] === 'buy_cc_20') priceTitle = '$20 CC (Est. Bal: $350+)';
    if (ctx.match[0] === 'buy_cc_30') priceTitle = '$30 CC (Est. Bal: $750+)';
    if (ctx.match[0] === 'buy_cc_40') priceTitle = '$40 CC (Est. Bal: $1200+)';

    ctx.reply(`🛒 You selected: *${priceTitle}*\n\n` + t.paymentInfo, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.callback(t.payButton, `paid_${ctx.match[0]}`)]
        ])
    });
});

bot.action('buy_paypal_logs', (ctx) => {
    const lang = userLang[ctx.from.id] || 'en';
    const t = langData[lang];
    ctx.reply(t.paypalDesc + t.paymentInfo, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.callback(t.payButton, 'paid_paypal_logs')]
        ])
    });
});

bot.action('buy_cashapp_logs', (ctx) => {
    const lang = userLang[ctx.from.id] || 'en';
    const t = langData[lang];
    ctx.reply(t.cashappDesc + t.paymentInfo, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.callback(t.payButton, 'paid_cashapp_logs')]
        ])
    });
});

bot.action(/paid_(.+)/, (ctx) => {
    ctx.reply(
        '📸 Please send your payment **Screenshot (SS)** right here in the chat, and write `/paymentdone` in the caption or reply to your screenshot with `/paymentdone` so admin gets notified instantly.',
        { parse_mode: 'Markdown' }
    );
});

bot.on('photo', async (ctx) => {
    const user = ctx.from;
    const username = user.username ? `@${user.username}` : user.first_name;
    const caption = ctx.message.caption || '';
    const lang = userLang[user.id] || 'en';
    const t = langData[lang];
    
    try {
        await ctx.telegram.sendPhoto(ADMIN_ID, ctx.message.photo[ctx.message.photo.length - 1].file_id, {
            caption: `🚨 *New Payment Screenshot Received!*\n\n👤 User: `${username}` (ID: \`${user.id}\`)\n💬 Caption: ${caption || 'None'}\n\n👉 Contact user or reply directly to deliver items.`,
            parse_mode: 'Markdown'
        });
        ctx.reply(t.sentNotice);
    } catch (err) {
        console.log('Error forwarding photo:', err);
        ctx.reply('⚠️ Error notifying admin. Please contact @voidxsecurityadmin directly.');
    }
});

bot.command('bin', (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length < 2) {
        return ctx.reply('⚠️ Usage format: `/bin [Country] [Query]`\nExample: `/bin US Amazon`', { parse_mode: 'Markdown' });
    }
    const country = args[0];
    const query = args.slice(1).join(' ');

    ctx.reply(
        `🔍 Searching for **${query}** in **${country.toUpperCase()}**...\n\n🟢 *Status:* Available!\n💳 BIN matched successfully. Contact @voidxsecurityadmin to purchase.`,
        { parse_mode: 'Markdown' }
    );
});

bot.launch();
console.log('b4mw3 Market Hub Bot is running with Userlist & Broadcast features...');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
