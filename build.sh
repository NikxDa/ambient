echo "================================================="
echo "Starting build..."

echo "Running CleanCSS..."
cleancss -o ambient.min.css src/ambient.css

echo "Running UglifyJS..."
uglifyjs -o ambient.min.js src/ambient.js

echo "Build complete."
echo "================================================="
