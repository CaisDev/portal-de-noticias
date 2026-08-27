const API_URL = "https://script.google.com/macros/s/AKfycbxSplq_s5tCcyfsUv0VMYoHnfl7zgdIvNn2CAZ4FjhLOMuUEIBcbXos-e1SLOQgk6klEg/exec?path=news";

function getId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function formatarData(isoDate) {
  if (!isoDate) return "";
  return new Date(isoDate).toLocaleDateString("pt-BR");
}

(async function iniciar() {
  const id = getId();

  const tituloEl = document.querySelector("#titulo");
  const metaEl = document.querySelector("#meta");
  const imgEl = document.querySelector("#imagem");
  const resumoEl = document.querySelector("#resumo");

  if (!id) {
    tituloEl.textContent = "Notícia não encontrada (sem id)";
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: "GET",
      redirect: "follow"
    });

    if (!res.ok) {
      tituloEl.textContent = "Erro ao carregar notícia";
      resumoEl.textContent = "Verifique o backend e as permissões de acesso.";
      return;
    }

    const data = await res.json();
    const listaOriginal = data.news || data.noticias || (Array.isArray(data) ? data : []);

    const noticiaRaw = listaOriginal.find(n => String(n.id || n.ID) === String(id));

    if (!noticiaRaw) {
      tituloEl.textContent = "Notícia não encontrada";
      resumoEl.textContent = "Ela pode não estar publicada ou o ID informado é inválido.";
      return;
    }

    const noticia = {
      titulo: noticiaRaw.nome || noticiaRaw.titulo || noticiaRaw.Nome || noticiaRaw.Titulo || "Sem título",
      categoria: noticiaRaw.categoria || noticiaRaw.Categoria || "Geral",
      autor: noticiaRaw.autor || noticiaRaw.Autor || "Anônimo",
      data: formatarData(noticiaRaw.data || noticiaRaw.Data),
      resumo: noticiaRaw.resumo || noticiaRaw.Resumo || "",
      imagem: noticiaRaw.imagem || noticiaRaw.Imagem || ""
    };

    tituloEl.textContent = noticia.titulo;
    metaEl.textContent = `${noticia.categoria} • ${noticia.data} • Por ${noticia.autor}`;
    resumoEl.textContent = noticia.resumo;

    if (noticia.imagem) {
      imgEl.src = noticia.imagem;
      imgEl.alt = noticia.titulo;
      imgEl.style.display = "block";
    }
  } catch (err) {
    console.error("Erro na busca da notícia:", err);
    tituloEl.textContent = "Erro ao carregar notícia";
    resumoEl.textContent = "Verifique a conexão ou a URL do backend.";
  }
})();
