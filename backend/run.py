from app import create_app, db

app = create_app()

if __name__ == "__main__":
    with app.app_context():  # Ensure we use an app context
        db.create_all()
    app.run(debug=True)
