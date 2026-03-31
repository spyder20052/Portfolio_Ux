#!/bin/bash

# Configuration
BASE_SRC="public/Projets"
BASE_DEST="public/assets/projects"

optimize_img() {
    local src="$1"
    local dest_dir="$2"
    local name="$3"
    
    if [ ! -f "$src" ]; then
        echo "Skip: $src not found"
        return
    fi

    echo "Optimizing $src -> $dest_dir/$name"
    
    # Large (1920)
    convert "$src" -resize 1920x "$dest_dir/${name}-large.webp"
    # Medium (1200)
    convert "$src" -resize 1200x "$dest_dir/${name}-medium.webp"
    # Small (600)
    convert "$src" -resize 600x "$dest_dir/${name}-small.webp"
    
    # Original (as large)
    cp "$dest_dir/${name}-large.webp" "$dest_dir/${name}.webp"
}

# Project Mapping (Slug -> Source Folder -> Cover/Hero candidates)
declare -A projects
projects["arbitra"]="Arbitra:1.webp:Hero.webp"
projects["snaki"]="Snaki:1.webp:2.webp"
projects["astro"]="Astro:home.webp:home.webp"
projects["crispy"]="Crispy:crispy.webp:Desktop2.webp"
projects["zitawi"]="Zitawi:1.webp:2.webp"
projects["nextgen"]="NextGen:1.webp:2.webp"
projects["scan360"]="Scan360:1.webp:2.webp"
projects["future-studio"]="Future_Studio:1.webp:2.webp"
projects["lab"]="Student Innovation Lab:1.webp:2.webp"
projects["branding-1"]="Logo ArbitraChain:1.webp:2.webp"
projects["branding-2"]="Logo Ilot Foncier:1.webp:2.webp"
projects["experiments-1"]="Visuel Halloween pour le BDE:1.webp:2.webp"
projects["experiments-2"]="Ma signature mail:1.webp:1.webp"
projects["visual-1"]="Vintage:1.webp:2.webp"
projects["visual-2"]="Visuel Vintage:1.webp:2.webp"
projects["visual-3"]="Visuel pour le BDE:1.webp:2.webp"
projects["shooting-1"]="Generation de shooting pour visuel de marque:1.webp:2.webp"
projects["divers-1"]="Divers:1.webp:2.webp"
projects["cv"]="Cv:1.webp:1.webp"
projects["feller"]="Feller:1.webp:1.webp"


for slug in "${!projects[@]}"; do
    IFS=':' read -r folder cover hero <<< "${projects[$slug]}"
    dest="$BASE_DEST/$slug"
    mkdir -p "$dest"
    
    optimize_img "$BASE_SRC/$folder/$cover" "$dest" "cover"
    optimize_img "$BASE_SRC/$folder/$hero" "$dest" "hero"
    
    # Gallery (try to find up to 3)
    count=1
    for f in "$BASE_SRC/$folder"/*.webp; do
        if [[ "$f" != *"$cover" && "$f" != *"$hero" && $count -le 3 ]]; then
            optimize_img "$f" "$dest" "gallery-0$count"
            ((count++))
        fi
    done
done
