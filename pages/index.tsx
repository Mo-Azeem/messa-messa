import Head from "next/head";

export default function Index() {
  return (
    //h-screen w-screen
    <div className="chat-box flex flex-col justify-between relative">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      {/* {lastMsg && <h1>{JSON.stringify(lastMsg)}</h1>} */}
      <h1>Killed by Jimmy 😢</h1>
    </div>
  );
}
