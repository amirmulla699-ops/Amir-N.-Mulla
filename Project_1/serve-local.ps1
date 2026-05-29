$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 8080
$listener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Any, $port)
$listener.Start()

function Get-ContentType($path) {
  switch ([IO.Path]::GetExtension($path).ToLowerInvariant()) {
    '.html' { 'text/html; charset=utf-8'; break }
    '.css' { 'text/css; charset=utf-8'; break }
    '.js' { 'application/javascript; charset=utf-8'; break }
    '.jpeg' { 'image/jpeg'; break }
    '.jpg' { 'image/jpeg'; break }
    '.png' { 'image/png'; break }
    '.svg' { 'image/svg+xml'; break }
    '.json' { 'application/json; charset=utf-8'; break }
    '.txt' { 'text/plain; charset=utf-8'; break }
    default { 'application/octet-stream' }
  }
}

while ($true) {
  $client = $listener.AcceptTcpClient()
  try {
    $stream = $client.GetStream()
    $reader = [IO.StreamReader]::new($stream)
    $line = $reader.ReadLine()
    if (-not $line) {
      continue
    }

    while (($header = $reader.ReadLine()) -ne '') {}

    $url = ($line -split ' ')[1]
    $relativePath = [Uri]::UnescapeDataString(($url -split '\?')[0]).TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($relativePath)) {
      $relativePath = 'index.html'
    }

    $filePath = [IO.Path]::GetFullPath((Join-Path $root $relativePath))
    if (-not $filePath.StartsWith($root)) {
      $status = '403 Forbidden'
      $body = [Text.Encoding]::UTF8.GetBytes('Forbidden')
      $contentType = 'text/plain; charset=utf-8'
    } else {
      if (Test-Path $filePath -PathType Container) {
        $filePath = Join-Path $filePath 'index.html'
      }

      if (Test-Path $filePath -PathType Leaf) {
        $status = '200 OK'
        $body = [IO.File]::ReadAllBytes($filePath)
        $contentType = Get-ContentType $filePath
      } else {
        $status = '404 Not Found'
        $body = [Text.Encoding]::UTF8.GetBytes('Not Found')
        $contentType = 'text/plain; charset=utf-8'
      }
    }

    $responseHeader = "HTTP/1.1 $status`r`nContent-Type: $contentType`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
    $headerBytes = [Text.Encoding]::ASCII.GetBytes($responseHeader)
    $stream.Write($headerBytes, 0, $headerBytes.Length)
    $stream.Write($body, 0, $body.Length)
  } finally {
    $client.Close()
  }
}
