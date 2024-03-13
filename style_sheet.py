light = """
    QPushButton {
        padding: 8px;
    }

    QComboBox {
        padding: 7px;
    }
"""

dark = """
    QMainWindow {{
        background-color: #1c1c1c;
    }}

    QMenuBar {{
        background-color: #2e2e2e;
    }}

    QMenuBar::item {{
        background-color: #2e2e2e;
        color: #FFFFFF;
        padding: 5px;
    }}

    QMenuBar::item:selected {{
        background-color: #484848;
    }}

    QMenu {{
        background-color: #1c1c1c;
        border: 2px solid #ffffff;
    }}

    QMenu::item {{
        background-color: #1c1c1c;
        color: #FFFFFF;
    }}

    QMenu::item:selected {{
        background-color: #484848;
    }}

    QPushButton {{
        padding: 10px;
        border-radius: 3px;
        background-color: #2a2a2a;
        color: #FFFFFF;
    }}

    QPushButton:hover {{
        background-color: #2f2f2f;
    }}

    QPushButton:pressed {{
        background-color: #232323;
    }}

    QComboBox {{
        padding: 9px;
        border-radius: 3px;
        background-color: #2a2a2a;
        color: #FFFFFF;
    }}

    QComboBox::drop-down {{
        border: 0px;
        padding-right: 10px;
    }}

    QComboBox::down-arrow {{
        image: url({drop_down_arrow});
        width: 10px;
        height: 10px;
    }}

    QComboBox QAbstractItemView {{
        background-color: #2a2a2a;
        color: #FFFFFF;
    }}

    QDialog {{
        background-color: #1c1c1c;
    }}

    QLabel {{
        color: #FFFFFF;
    }}

    QTabWidget::pane {{
        border-top: 2px solid #2e2e2e;
    }}

    QTabBar::tab {{
        background-color: #2a2a2a;
        color: #FFFFFF;
        padding: 10px;
        border-radius: 3px;
    }}

    QTabBar::tab:hover {{
        background-color: #2f2f2f;
    }}

    QTabBar::tab:selected {{
        background-color: #232323;
    }}

    QTextEdit {{
        background-color: #2a2a2a;
        color: #FFFFFF;
        border: 2px solid rgba(168, 168, 168, 0.5);
        border-radius: 5px;
        padding: 3px;
    }}
"""
