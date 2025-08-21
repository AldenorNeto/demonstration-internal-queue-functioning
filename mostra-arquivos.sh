#!/bin/bash

set -euo pipefail

# Lê os caminhos da entrada padrão
while IFS= read -r filepath; do
    # Ignora linhas vazias
    [[ -z "$filepath" ]] && continue

    # Verifica se o arquivo existe
    if [[ -f "$filepath" ]]; then
        echo "// $filepath"
        cat "$filepath"
        echo
    else
        echo "// $filepath (arquivo não encontrado)"
        echo
    fi
done