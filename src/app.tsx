import {
  component$,
  useResource$,
  Resource,
  useSignal,
} from '@builder.io/qwik';
import { stylobj } from "powerstyl";
import yitimg from "./asset/yit.png";
export default component$(() => {
  const query = useSignal('busy');
  const jokes = useResource$<{
    name: string;
    description: string;
  }[]>(
    async ({ track, cleanup }) => {
      track(() => query.value);
      const controller = new AbortController();
      cleanup(() => controller.abort());
      const url = new URL('https://api.github.com/users/YITProject/repos');
      const resp = await fetch(url, { signal: controller.signal });
      const json = (await resp.json()) as {
        name: string;
        description: string;
      }[];
      return json;
    }
  );
  return (<main style={stylobj`
    align-items: center;
    flex-direction: column;
    display: flex;
    height: 100%;
    justify-content: center;` }>
    <img src={yitimg} alt="YIT" style={stylobj`width:220px;`} />
    <span style={stylobj`margin: .5em;font-weight: 900;font-size:1.1em;`}>
      YIT Poject
    </span>
    <span class="flex-center">
      <svg width="1.8em" height="1.2em" viewBox="0 0 48 48"><path d="M24 44C24 44 39 32 39 19C39 10.7157 32.2843 4 24 4C15.7157 4 9 10.7157 9 19C9 32 24 44 24 44Z" fill="currentCOlor" stroke="currentCOlor" stroke-width="3" stroke-linejoin="round" /><path d="M24 25C27.3137 25 30 22.3137 30 19C30 15.6863 27.3137 13 24 13C20.6863 13 18 15.6863 18 19C18 22.3137 20.6863 25 24 25Z" fill="#FFF" stroke="#FFF" stroke-width="3" stroke-linejoin="round" /></svg>
      中国 · 河北
    </span>
    <section style={stylobj`margin: 1em auto;line-height: 2em;`}>
      <Resource
        value={jokes}
        onPending={() => <>loading</>}
        onResolved={(jokes) => (
          <>
            {jokes.map((joke, i) => (
              <a key={i} href={`//github.com/yitproject/${joke.name}/`} style={stylobj`
        display: flex;
        flex-direction: column;
        align-items: center;
        border-bottom: 1px solid;` } >
                <span title="Name">
                  {joke.name}
                </span>
                {
                  joke.description && <aside title="Description" style={stylobj`
          font-size: 90%;
          color: cadetblue;
          margin-top: -0.55em;` }>{joke.description}</aside>
                }
              </a>
            ))}
          </>
        )}
      />
    </section>
  </main>
  );
});