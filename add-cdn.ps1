$files = Get-ChildItem "d:\acolude\adem bey\mmc\*.html"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match 'supabase') {
        $oldTag = '<script src="assets/js/themefunction.js">'
        $newTag = '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script> <script src="assets/js/themefunction.js">'
        $content = $content.Replace($oldTag, $newTag)
        Set-Content $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.Name)"
    }
}
