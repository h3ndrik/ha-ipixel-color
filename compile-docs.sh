#!/bin/bash

# Compilation script for iPIXEL Protocol Documentation

echo "Compiling iPIXEL Protocol Documentation..."
echo ""

# Change to documentation directory
cd ipixel-protocol-doc || exit 1

# Check if pdflatex is available
if ! command -v pdflatex &> /dev/null; then
    echo "Error: pdflatex not found!"
    echo "Please run ./install-latex.sh first"
    exit 1
fi

# Clean previous build files (optional)
echo "Cleaning previous build files..."
rm -f *.aux *.log *.toc *.out *.bbl *.blg 2>/dev/null

# First pass - generate aux files
echo "Running first LaTeX pass..."
pdflatex -interaction=nonstopmode main.tex > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Error during first LaTeX pass. Check main.log for details."
    exit 1
fi

# Run BibTeX for bibliography
echo "Processing bibliography..."
bibtex main > /dev/null 2>&1

# Second pass - incorporate bibliography
echo "Running second LaTeX pass..."
pdflatex -interaction=nonstopmode main.tex > /dev/null 2>&1

# Third pass - resolve cross-references
echo "Running final LaTeX pass..."
pdflatex -interaction=nonstopmode main.tex > /dev/null 2>&1

# Check if PDF was created
if [ -f "main.pdf" ]; then
    echo ""
    echo "✓ Documentation compiled successfully!"
    echo "  Output: ipixel-protocol-doc/main.pdf"
    
    # Get file size
    SIZE=$(ls -lh main.pdf | awk '{print $5}')
    echo "  Size: $SIZE"
    
    # Optionally open the PDF (macOS)
    echo ""
    read -p "Open PDF now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open main.pdf
    fi
else
    echo "✗ PDF generation failed"
    echo "Check ipixel-protocol-doc/main.log for errors"
    exit 1
fi