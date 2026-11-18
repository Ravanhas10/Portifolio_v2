var KEY = "portfolio-escolar-v1";
var seed = {
    turmas: [{ id: 1, nome: "1º Ano B", ano: 2026, turno: "Manhã" }, { id: 2, nome: "1º Ano B", ano: 2026, turno: "Tarde" }],
    alunos: [{ id: 1, nome: "Igor de Oliveira", email: "igor@escola.com", turmaId: 1, tel: "(11) 90000-1111", hab: "Design, HTML, CSS", bio: "Gosta de interfaces limpas e de contar histórias com dados." }, { id: 2, nome: "Lucas Prado", email: "lucas@escola.com", turmaId: 2, tel: "", hab: "JavaScript, Lógica", bio: "" }],
    projetos: [{ id: 1, titulo: "Site da Biblioteca", desc: "Catálogo online com busca por título e autor.", alunoId: 1, link: "", tags: "HTML, CSS", data: "2026-09-10" }, { id: 2, titulo: "Jogo da Memória", desc: "Jogo simples feito com JavaScript puro.", alunoId: 2, link: "", tags: "JavaScript", data: "2026-10-02" }]
};
function $(i) { return document.getElementById(i) }
function load() { try { var s = localStorage.getItem(KEY); if (s) return JSON.parse(s) } catch (e) { } return JSON.parse(JSON.stringify(seed)) }
var db = load(), M = $("main"), cores = ["#a8f08a", "#f6d66b", "#8fd3f4", "#f4a6a6", "#c9b6f2"];
function save() { try { localStorage.setItem(KEY, JSON.stringify(db)) } catch (e) { } }
function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] }) }
function nid(a) { return a.reduce(function (m, x) { return Math.max(m, x.id) }, 0) + 1 }
function by(a, id) { return a.filter(function (x) { return x.id == id })[0] }
function fmt(d) { return d ? d.split("-").reverse().join("/") : "" }
function fd(e) { var d = {}; new FormData(e.target).forEach(function (v, k) { d[k] = v }); return d }
function head(t, p, a) { return '<div class="head"><div><h1>' + t + '</h1>' + (p ? '<p>' + p + '</p>' : '') + '</div>' + (a || '') + '</div>' }
function empty(m, href, l) { return '<div class="card empty">' + m + '<br><br><a class="btn" href="' + ROOT + href + '">' + l + '</a></div>' }
function turmaOpts(v) { return db.turmas.map(function (t) { return '<option value="' + t.id + '"' + (t.id == v ? ' selected' : '') + '>' + esc(t.nome) + '</option>' }).join("") }
function alunoOpts(v) { return db.alunos.map(function (a) { return '<option value="' + a.id + '"' + (a.id == v ? ' selected' : '') + '>' + esc(a.nome) + '</option>' }).join("") }
function projCard(p, i) { var a = by(db.alunos, p.alunoId); return '<article class="card proj"><div class="thumb" style="background:' + cores[i % 5] + '">' + esc(p.titulo) + '</div><h3>' + esc(p.titulo) + '</h3><p>' + esc(p.desc) + '</p><div>' + p.tags.split(",").filter(function (t) { return t.trim() }).map(function (t) { return '<span class="tag">' + esc(t.trim()) + '</span>' }).join("") + '</div><div class="meta">' + (a ? esc(a.nome) + ' · ' : '') + fmt(p.data) + '</div>' + (p.link ? '<a href="' + esc(p.link) + '" target="_blank" rel="noopener">Abrir projeto</a>' : '') + '</article>' }
function toast(m) { var t = document.createElement("div"); t.className = "toast"; t.textContent = m; t.setAttribute("role", "status"); document.body.appendChild(t); setTimeout(function () { t.remove() }, 2200) }
function go(p, m) { try { sessionStorage.setItem("msg", m) } catch (e) { } location.href = ROOT + p }
function logado() { try { return sessionStorage.getItem("logado") == "1" } catch (e) { return true } }
function sair() { try { sessionStorage.removeItem("logado") } catch (e) { } location.href = ROOT + "Login.html" }
var itens = [["index.html", "Dashboard"], ["Cadastros/CadastroTurma.html", "Cadastrar turma"], ["Listagens/ListagemTurma.html", "Turmas"], ["Cadastros/CadatroAluno.html", "Cadastrar aluno"], ["Listagens/ListagemAluno.html", "Alunos"], ["Cadastros/CadatroProjeto.html", "Cadastrar projeto"], ["Listagens/ListagemProjeto.html", "Projetos"], ["Portfolio.html", "Portfólio individual"]];
if (!window.PUBLIC && !logado()) location.replace(ROOT + "Login.html");
if ($("menu")) { var cur = location.pathname.split("/").pop(); $("menu").setAttribute("aria-label", "Principal"); $("menu").innerHTML = '<div class="logo"><i></i>Portfólio Escolar</div>' + itens.map(function (m) { var on = m[0].split("/").pop() == cur; return '<a href="' + ROOT + m[0] + '"' + (on ? ' class="on" aria-current="page"' : '') + '>' + m[1] + '</a>' }).join("") + '<button class="btn ghost sm" onclick="sair()">Sair</button>' }
try { var msg = sessionStorage.getItem("msg"); if (msg) { sessionStorage.removeItem("msg"); toast(msg) } } catch (e) { }
document.addEventListener("click", function (e) { var b = e.target.closest("[data-del]"); if (!b) return; var p = b.dataset.del.split(":"); if (!confirm("Excluir este item?")) return; db[p[0]] = db[p[0]].filter(function (x) { return x.id != p[1] }); if (p[0] == "alunos") db.projetos = db.projetos.filter(function (x) { return x.alunoId != p[1] }); save(); try { sessionStorage.setItem("msg", "Item excluído") } catch (x) { } location.reload() });