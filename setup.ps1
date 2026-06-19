param(
  [string]$RepoUrl = "https://github.com/abnerns/projeto-oficina2.git",
  [string]$ProjectDir = "$PWD\projeto-oficina2"
)

function Write-Step {
  param([string]$Message)
  Write-Host "`n==> $Message" -ForegroundColor Cyan
}

function Write-Error {
  param([string]$Message)
  Write-Host "ERRO: $Message" -ForegroundColor Red
}

function Write-Success {
  param([string]$Message)
  Write-Host "OK: $Message" -ForegroundColor Green
}

# ------------------------------------------------------------
Write-Step "Verificando Git"
# ------------------------------------------------------------
try {
  $gitVersion = git --version 2>$null
  Write-Success "Git ja instalado: $gitVersion"
}
catch {
  Write-Step "Instalando Git via winget..."
  winget install --id Git.Git --exact --silent --accept-package-agreements --accept-source-agreements
  if ($LASTEXITCODE -ne 0) {
    Write-Error "Falha ao instalar o Git. Instale manualmente em https://git-scm.com"
    exit 1
  }
  Write-Success "Git instalado com sucesso"
}

# ------------------------------------------------------------
Write-Step "Verificando Node.js"
# ------------------------------------------------------------
$nodeVersion = $null
try {
  $nodeVersion = node --version 2>$null
}
catch {}

if ($nodeVersion -and $nodeVersion -match 'v(\d+)') {
  $major = [int]$Matches[1]
  if ($major -ge 18) {
    Write-Success "Node.js ja instalado: $nodeVersion"
  }
  else {
    Write-Error "Node.js $nodeVersion detectado, mas e necessario >= 18."
    Write-Step "Atualizando Node.js via winget..."
    winget install --id OpenJS.NodeJS.LTS --exact --silent --accept-package-agreements --accept-source-agreements
  }
}
else {
  Write-Step "Instalando Node.js via winget..."
  winget install --id OpenJS.NodeJS.LTS --exact --silent --accept-package-agreements --accept-source-agreements
  if ($LASTEXITCODE -ne 0) {
    Write-Error "Falha ao instalar o Node.js. Instale manualmente em https://nodejs.org"
    exit 1
  }
  Write-Success "Node.js instalado com sucesso"
}

# ------------------------------------------------------------
Write-Step "Verificando npm"
# ------------------------------------------------------------
try {
  $npmVersion = npm --version 2>$null
  Write-Success "npm ja disponivel: v$npmVersion"
}
catch {
  Write-Error "npm nao encontrado. Ele deveria vir com o Node.js. Instale manualmente."
  exit 1
}

# ------------------------------------------------------------
Write-Step "Clonando repositorio"
# ------------------------------------------------------------
if (Test-Path -LiteralPath "$ProjectDir\.git") {
  Write-Success "Repositorio ja clonado em $ProjectDir"
  Set-Location -LiteralPath $ProjectDir
}
else {
  Write-Step "Clonando $RepoUrl em $ProjectDir..."
  git clone $RepoUrl $ProjectDir
  if ($LASTEXITCODE -ne 0) {
    Write-Error "Falha ao clonar o repositorio."
    exit 1
  }
  Set-Location -LiteralPath $ProjectDir
  Write-Success "Repositorio clonado"
}

# ------------------------------------------------------------
Write-Step "Instalando dependencias do projeto"
# ------------------------------------------------------------
npm install
if ($LASTEXITCODE -ne 0) {
  Write-Error "Falha ao instalar dependencias. Execute 'npm install' manualmente."
  exit 1
}
Write-Success "Dependencias instaladas"

# ------------------------------------------------------------
Write-Step "Executando migracoes do banco de dados"
# ------------------------------------------------------------
npm run migrate
if ($LASTEXITCODE -ne 0) {
  Write-Error "Migracao falhou. Verifique se o arquivo .env esta configurado corretamente."
  exit 1
}
Write-Success "Migracoes executadas"

# ------------------------------------------------------------
Write-Host "`n============================================" -ForegroundColor Green
Write-Host "  Setup concluido com sucesso!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host "`nProximo passos:" -ForegroundColor Yellow
Write-Host "  1. Configure o arquivo .env na raiz do projeto com as variaveis de ambiente" -ForegroundColor White
Write-Host "  2. Coloque o arquivo serviceAccount.json em back-end/src/common/admin/" -ForegroundColor White
Write-Host "  3. Execute 'npm run dev' para iniciar o front-end (porta 8080)" -ForegroundColor White
Write-Host "  4. Execute 'npm run back' para iniciar o back-end (porta 3333)" -ForegroundColor White
Write-Host "  5. Acesse o sistema em http://localhost:8080`n" -ForegroundColor White
