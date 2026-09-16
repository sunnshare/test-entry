@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo   [1/4] 正在打包前端...
echo ========================================
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo   前端打包失败！
    pause
    exit /b 1
)

echo.
echo ========================================
echo   [2/4] 正在生成发布目录...
echo ========================================

set "OUT=%~dp0release"
if exist "%OUT%" rd /s /q "%OUT%"
mkdir "%OUT%\dist"

:: 复制 dist 产物
xcopy /q /y /e dist\*.* "%OUT%\dist\" >nul

:: 复制 Mac 启动脚本和 nginx 配置
copy /y start.command "%OUT%\start.command" >nul
copy /y nginx.conf "%OUT%\nginx.conf" >nul

echo.
echo ========================================
echo   [3/4] 正在编译 exe...
echo ========================================

:: 使用 Windows 自带的 C# 编译器
set "CSC=C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if not exist "%CSC%" (
    echo   找不到 csc.exe，无法编译
    pause
    exit /b 1
)

"%CSC%" /nologo /target:exe /out:"%OUT%\test-entry.exe" /optimize+ server.cs
if %errorlevel% neq 0 (
    echo   exe 编译失败！
    pause
    exit /b 1
)

echo.
echo ========================================
echo   [4/4] 正在打包 zip...
echo ========================================

set "ZIP=%~dp0test-entry.zip"
if exist "%ZIP%" del /f "%ZIP%"

:: 打包 exe、dist、Mac 启动脚本和 nginx 配置
powershell -Command "Compress-Archive -Path '%OUT%\test-entry.exe', '%OUT%\dist', '%OUT%\start.command', '%OUT%\nginx.conf' -DestinationPath '%ZIP%' -Force"

echo.
echo ========================================
echo   完成！
echo ========================================
echo.
echo   发布目录: %OUT%
echo   压缩包:   %ZIP%
echo.
echo   把 test-entry.zip 发给别人即可
echo   Windows: 解压后双击 test-entry.exe 自动打开浏览器
echo   Mac:     解压后双击 start.command 自动打开浏览器
echo ========================================
echo.
pause
