white = """
    QPushButton {{
        padding: 6px;
    }}

    QComboBox {{
        padding: 4px;
    }}

    QLineEdit {{
        padding: 5px;
    }}
"""

black = """
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
        padding: 9px;
        border-radius: 3px;
        background-color: #2a2a2a;
        color: #FFFFFF;
        outline: none;
    }}

    QPushButton:hover {{
        background-color: #2f2f2f;
    }}

    QPushButton:pressed {{
        background-color: #232323;
    }}

    QComboBox {{
        padding: 7px;
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

    QSlider::groove:horizontal {{
        border: 1px solid #555555;
        height: 3px;
    }}

    QSlider::handle:horizontal {{
        background: #2e2e2e;
        border: 1px solid #5c5c5c;
        width: 12px;
        margin: -6px -1px;
        border-radius: 6px;
    }}

    QSlider::handle:horizontal:hover {{
        background: #223e55;
    }}

    QSlider::add-page:horizontal {{
        background: #555555;
    }}

    QSlider::sub-page:horizontal {{
        background: #2e2e2e;
    }}

    QLineEdit, QSpinBox {{
        background-color: #2a2a2a;
        color: #FFFFFF;
        border: 1px solid #555555;
        border-radius: 3px;
        padding: 6px;
    }}

    QSpinBox::up-button {{
        image: url({spin_box_up});
        width: 13px;
    }}

    QSpinBox::down-button {{
        image: url({spin_box_down});
        width: 13px;
    }}

    QLineEdit:focus, QSpinBox:focus {{
        border-bottom: 2px solid #007ad9;
    }}

    QScrollBar:vertical {{
        background-color: #2f2f2f;
        width: 15px;
        margin: 15px 0 15px 0;
    }}

    QScrollBar::handle:vertical {{
        background-color: #636363;
        min-height: 20px;
        border-radius: 3px;
        margin: 0 4px 0 4px;
    }}

    QScrollBar::handle:vertical:hover {{
        background-color: #6f6f6f;
    }}

    QScrollBar::handle:vertical:pressed {{
        background-color: #5c5c5c;
    }}

    QScrollBar::sub-line:vertical {{
        image: url({scroll_bar_top});
        background-color: #2f2f2f;
        height: 15px;
        border-top-left-radius: 7px;
        border-top-right-radius: 7px;
        subcontrol-position: top;
        subcontrol-origin: margin;
    }}

    QScrollBar::add-line:vertical {{
        image: url({scroll_bar_bottom});
        background-color: #2f2f2f;
        height: 15px;
        border-bottom-left-radius: 7px;
        border-bottom-right-radius: 7px;
        subcontrol-position: bottom;
        subcontrol-origin: margin;
    }}

    QScrollBar::add-page:vertical, QScrollBar::sub-page:vertical {{
        background: none;
    }}

    QScrollBar:horizontal {{
        background-color: #2f2f2f;
        height: 15px;
        margin: 0 15px 0 15px;
    }}

    QScrollBar::handle:horizontal {{
        background-color: #636363;
        min-width: 20px;
        border-radius: 3px;
        margin: 4px 0 4px 0;
    }}

    QScrollBar::handle:horizontal:hover {{
        background-color: #6f6f6f;
    }}

    QScrollBar::handle:horizontal:pressed {{
        background-color: #5c5c5c;
    }}

    QScrollBar::sub-line:horizontal {{
        image: url({scroll_bar_left});
        background-color: #2f2f2f;
        width: 15px;
        border-top-left-radius: 7px;
        border-bottom-left-radius: 7px;
        subcontrol-position: left;
        subcontrol-origin: margin;
    }}

    QScrollBar::add-line:horizontal {{
        image: url({scroll_bar_right});
        background-color: #2f2f2f;
        width: 15px;
        border-top-right-radius: 7px;
        border-bottom-right-radius: 7px;
        subcontrol-position: right;
        subcontrol-origin: margin;
    }}

    QScrollBar::add-page:horizontal, QScrollBar::sub-page:horizontal {{
        background: none;
    }}
"""
