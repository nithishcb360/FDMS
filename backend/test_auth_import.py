import sys
import traceback

try:
    from app.api import auth
    print("[OK] Auth module imported successfully")
    print(f"[OK] Router object: {auth.router}")
    print(f"[OK] Router routes: {[route.path for route in auth.router.routes]}")
except Exception as e:
    print(f"[ERROR] Failed to import auth module")
    print(f"Error: {e}")
    traceback.print_exc()

try:
    from app import main
    print("\n[OK] Main app imported successfully")
    print(f"[OK] Number of routes: {len(main.app.routes)}")

    # Check if auth routes are included
    auth_routes = [route for route in main.app.routes if hasattr(route, 'path') and '/auth' in route.path]
    print(f"[OK] Auth routes found: {len(auth_routes)}")
    for route in auth_routes:
        print(f"  - {route.path}")
except Exception as e:
    print(f"\n[ERROR] Failed to check main app")
    print(f"Error: {e}")
    traceback.print_exc()
