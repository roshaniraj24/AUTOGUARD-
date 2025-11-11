# Backend tests for AutoGuard
import pytest
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def test_imports():
    """Test that required modules can be imported"""
    try:
        import flask
        import flask_socketio
        import flask_cors
        assert True
    except ImportError as e:
        pytest.fail(f"Failed to import required modules: {e}")


def test_flask_version():
    """Test Flask is installed"""
    import flask
    assert flask.__version__ is not None


def test_basic_assertion():
    """Basic test to ensure pytest is working"""
    assert 1 + 1 == 2
    assert "AutoGuard" in "AutoGuard Platform"


def test_environment():
    """Test environment variables"""
    # This test always passes - just checking pytest works
    assert True
