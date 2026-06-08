# Reinstall skills.sh packages from skills-lock.json (run from project root)
Set-Location $PSScriptRoot\..

Write-Host "Installing animation + Vercel skill packs..." -ForegroundColor Cyan

npx skills add patricio0312rev/skills --skill framer-motion-animator
npx skills add daffy0208/ai-dev-standards --skill animation-designer
npx skills add cloudai-x/threejs-skills
npx skills add vercel-labs/json-render --skill react-three-fiber
npx skills add github/awesome-copilot --skill gsap-framer-scroll-animation
npx skills add dylantarre/animation-principles --skill scroll-animations
npx skills add dylantarre/animation-principles --skill gsap-greensock
npx skills add raphaelsalaja/skill --skill 12-principles-of-animation
npx skills add vercel-labs/agent-skills

Write-Host "Done. GSAP user skills: ~/.agents/skills/gsap-*" -ForegroundColor Green
