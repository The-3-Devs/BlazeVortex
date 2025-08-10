# BlazeVortex

## *BlazeVortex is a Discord bot that adds extra humor to any conversation by leveraging AI to generate funny, contextually accurate, rude messages!*

## **IMPORTANT: Read [CONTRIBUTING.md](/CONTRIBUTING.md) before working/commiting any changes**

*Not doing so may result in your changes being automatically reverted*

> # WARNING:  
> We are not responsible of any type(s) of damage caused by 
> BlazeVortex **At All** (exception is there for the topics of
>religion! You may DM (Direct Message) a T3D member such as Arti
>(discord id: artificialxdev) )
> Visit our website for more info: [BlazeVortex](https://www.blazevortexbot.com)

# 🚧 Development Instructions

### 1. ✅ Install Node.js 22

Make sure you have **Node.js v22** installed. You can check by running:

```bash
node -v
```

> If not installed, download it from [https://nodejs.org/](https://nodejs.org/)

---

### 2. 📦 Install Dependencies

Run the following command in your terminal to install required packages:

```bash
npm run setup
```

---

### 3. ⚙️ Create Your `config.json` File

Create a file named `config.json` inside the `./src` directory.

---

### 4. ✍️ Fill in `config.json` with This Template:

```json
{
  "token": "[Your Discord Bot Token]",
  "admins": [ // please remove these ids if you dont want us tinkerin with your bot
    "922052576579579904",
    "148851320453857280",
    "977131375431913522",
    "1305246362933133403",
    "1209132582650773586",
    "1363145812984594552",
    "[Your Discord User ID]"
  ],
  "geminiApiKey": "[Your Gemini API Key]",
  "clientId": "[Your Bot's Application ID]",
  "guildId": "1250896904854962189", 
  "isBV-IB": false // set this to false forever!
}
```

---

## 🔐 How to Get the Required Info

### 🧪 Discord Setup

#### ✅ Get Your Bot Token:
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **New Application** or open your existing one.
3. Navigate to **Bot** → click **"Add Bot"** if you haven’t.
4. Under the **Token** section, click **"Reset Token"** → **Copy it** and paste into `"token"`.

#### 👤 Get Your Discord User ID:
1. Open Discord → go to **User Settings** → **Advanced** → enable **Developer Mode**.
2. Right-click on yourself in any server → click **“Copy User ID”**.

#### 🤖 Get Your Bot’s Client ID:
1. In the Developer Portal, open your application.
2. On the **General Information** page, copy the **Application ID** → paste into `"clientId"`.

---

### 🔮 Get a Gemini API Key (Google AI)

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
2. Click **"Create API Key"**.
3. Copy the key and paste it into `"geminiApiKey"`.

> This key gives access to Google's Gemini model for AI capabilities.
