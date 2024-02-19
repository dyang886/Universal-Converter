light = """
    QPushButton {
        padding: 8px;
    }

    QComboBox {
        padding: 7px;
    }
"""

dark = """
    QMainWindow {
        background-color: #1c1c1c;
    }

    QMenuBar {
        background-color: #2e2e2e;
    }

    QMenuBar::item {
        background-color: #2e2e2e;
        color: #FFFFFF;
        padding: 5px;
    }

    QMenuBar::item:selected {
        background-color: #484848;
    }

    QMenu {
        background-color: #1c1c1c;
        border: 2px solid #ffffff;
    }

    QMenu::item {
        background-color: #1c1c1c;
        color: #FFFFFF;
    }

    QMenu::item:selected {
        background-color: #484848;
    }

    QPushButton {
        padding: 10px;
        border-radius: 3px;
        background-color: #2a2a2a;
        color: #FFFFFF;
    }

    QPushButton:hover {
        background-color: #2f2f2f;
    }

    QPushButton:pressed {
        background-color: #232323;
    }

    QComboBox {
        padding: 9px;
        border-radius: 3px;
        background-color: #2a2a2a;
        color: #FFFFFF;
    }

    QComboBox::drop-down {
        border: 0px;
        padding-right: 10px;
    }

    QComboBox::down-arrow {
        image: url(assets/dropdown.png);
        width: 10px;
        height: 10px;
    }

    QComboBox QAbstractItemView {
        background-color: #2a2a2a;
        color: #FFFFFF;
    }

    QDialog {
        background-color: #1c1c1c;
    }

    QLabel {
        color: #FFFFFF;
    }
"""
