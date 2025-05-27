echo "Starting Backend"
cd DAMS || exit 1
python manage.py runserver 0.0.0.0:2000 &
cd ..

# Start React app
echo "Starting React..."
cd frontend || exit 1
npm run dev