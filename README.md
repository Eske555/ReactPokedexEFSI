# 🎮 POKÉDEX REACT - EDICIÓN RETRO 8-BIT

Aplicación completa de Pokédex desarrollada en **React** con diseño retro inspirado en Pokémon N64/Game Boy. Consume la API pública de Pokémon (PokeAPI).

---

## ✨ CARACTERÍSTICAS PRINCIPALES

### 🎨 DISEÑO Y ESTILO
- **Estética 8-bit completa** con fuente Press Start 2P
- **Renderizado pixelado** de sprites e imágenes
- **Animaciones retro** con `steps()` para efecto Game Boy
- **Paleta de colores clásica**: rojo (#ff1111), amarillo (#ffcc00), azul (#3366ff)
- **Splash screen animado** con Pikachu corriendo
- **Diseño responsive** para móviles, tablets y desktop

### 🔍 BÚSQUEDA Y NAVEGACIÓN
- **Búsqueda por nombre o ID** de Pokémon
- **Búsqueda por tipo** (fire, water, electric, etc.)
- **Vista de grilla completa** con todos los Pokémon (898 total)
- **Paginación inteligente** con 20 Pokémon por página
- **Salto directo a página** específica
- **Sugerencias automáticas** cuando no se encuentra un Pokémon

### 🎯 FILTROS Y ORDENAMIENTO
- **Filtro por tipo**: 18 tipos diferentes (normal, fire, water, electric, grass, ice, fighting, poison, ground, flying, psychic, bug, rock, ghost, dragon, dark, steel, fairy)
- **Filtro por generación**: Gen I a Gen VIII con rangos de ID
- **Ordenamiento múltiple**: por ID, nombre, altura o peso
- **Reseteo de filtros** con botón "Todos los Pokémon"

### 📊 INFORMACIÓN DETALLADA
- **Vista de detalle completa** con 4 pestañas:
  - **INFO**: Estadísticas base, habilidades, descripción, altura, peso
  - **MOVES**: 20 movimientos con poder, precisión, PP y clase
  - **EVOLUTION**: Cadena evolutiva completa con sprites grandes y métodos
  - **LOCATIONS**: Lugares donde encontrar el Pokémon
- **Variantes shiny** disponibles con botón de toggle
- **Barras de estadísticas animadas** con colores según valor
- **Badges de tipos** con colores específicos

### ⚔️ MODO BATALLA
- **Sistema de batalla por turnos** estilo Pokémon Platino
- **Selección de oponente**: aleatorio o por nombre
- **3 movimientos únicos** por Pokémon con efectos visuales
- **Cálculo de daño realista** basado en poder del Pokémon
- **Sistema de cooldown** para movimientos poderosos (cada 2 turnos)
- **Efectos de ataque exagerados** con múltiples capas y animaciones
- **Mensajes de efectividad** de tipo
- **Barras de HP animadas** con colores según salud
- **IA enemiga** con selección aleatoria de movimientos
- **Pantalla de victoria/derrota** con marcador 6-0
- **Iniciar batalla desde detalle** de cualquier Pokémon

### 👥 GESTIÓN DE EQUIPO
- **Equipo de hasta 6 Pokémon**
- **Agregar/quitar** desde vista de detalle con botón estrella
- **Vista de equipo modal** con todos los miembros
- **Persistencia en localStorage**
- **Slots vacíos visuales** para completar equipo
- **Botón animado** "★ MI EQUIPO" en header

### 📜 HISTORIAL DE POKÉMON
- **Tracking automático** de todos los Pokémon vistos
- **Estadísticas de visualización**: total visto y únicos
- **Top 5 más vistos** con contador de veces
- **Timeline cronológica** agrupada por fecha
- **Timestamps relativos** (hace 5m, hace 2h, etc.)
- **Click para ver detalle** desde historial
- **Botón para limpiar** todo el historial
- **Persistencia en localStorage**

### 🎲 MODO QUIZ/TRIVIA
- **3 tipos de juegos**:
  - **"Who's That Pokémon?"**: Adivinar por silueta
  - **"Pokédex Entry"**: Adivinar por descripción
  - **"Stats Master"**: Adivinar por estadísticas
- **Opción múltiple** con 4 opciones
- **Sistema de puntuación** con high score
- **Feedback visual** de respuestas correctas/incorrectas
- **Logro especial** por 10 respuestas correctas

### 🧮 CALCULADORA DE DAÑO
- **Selección de atacante y defensor**
- **Elección de movimiento** del atacante
- **Cálculo realista** considerando:
  - Poder del movimiento
  - Estadísticas de ataque/defensa
  - STAB (Same Type Attack Bonus)
  - Efectividad de tipo
  - Movimientos físicos vs especiales
- **Tabla completa** de efectividad de tipos (18x18)
- **Visualización de daño** en HP y porcentaje

### 📈 GRÁFICO RADAR DE STATS
- **Visualización hexagonal** de las 6 estadísticas
- **Implementación pura CSS/SVG** sin librerías externas
- **Animación pulsante** del polígono
- **Etiquetas posicionadas** alrededor del hexágono
- **Muestra total y promedio** de stats

### 🧬 GENERADOR DE FUSIONES
- **Fusión de 2 Pokémon** (selección manual o aleatoria)
- **Nombre combinado**: primera mitad + segunda mitad
- **Tipos fusionados**: únicos, máximo 2
- **Estadísticas promediadas** de ambos
- **Habilidades combinadas**
- **Altura y peso promediados**
- **Sprites originales** con animación de flecha
- **Historial de fusiones**: últimas 10 guardadas
- **Animación de revelación** del resultado

### 🎨 ANIMACIONES Y EFECTOS
- **Sprites flotantes** en tarjetas
- **Marcos pulsantes** con efecto 8-bit
- **Nombres con glow** animado
- **Stats apareciendo secuencialmente**
- **Habilidades con rotación**
- **Tipos con bounce**
- **Efectos de ataque** cubriendo pantalla completa
- **Transiciones pixeladas** con `steps()`

### 💾 PERSISTENCIA DE DATOS
- **Equipo guardado** en localStorage
- **Historial de visualizaciones** en localStorage
- **Fusiones guardadas** en localStorage
- **High scores de quiz** en localStorage
- **Sincronización automática** entre componentes

---

## 🛠️ TECNOLOGÍAS

- **React 18** con Hooks
- **Vite** como bundler
- **CSS3** puro (sin frameworks)
- **PokeAPI** para datos
- **LocalStorage** para persistencia

---

## 🎯 COMPONENTES PRINCIPALES

- `SplashScreen` - Pantalla de inicio con Pikachu animado
- `Header` - Navegación con botones de equipo e historial
- `SearchBar` - Búsqueda inteligente con sugerencias
- `PokemonGridView` - Vista de grilla con paginación
- `PokemonCard` - Tarjeta individual estilo álbum
- `PokemonDetail` - Vista detallada con pestañas
- `FilterBar` - Filtros por tipo, generación y ordenamiento
- `BattleMode` - Sistema de batalla completo
- `BattleSelector` - Selección de oponente
- `TeamView` - Gestión de equipo
- `PokemonHistory` - Historial y estadísticas
- `QuizMode` - Modo trivia con 3 juegos
- `DamageCalculator` - Calculadora de daño
- `StatsRadar` - Gráfico hexagonal de stats
- `FusionGenerator` - Generador de fusiones

---

## 👥 CRÉDITOS

Desarrollado por:
- [ESKE555](https://github.com/eske555)
- [THEOTROSMAN](https://github.com/theotrosman)
- [SEBACALVINO](https://github.com/sebacalvino)

---

⚡ ¡Atrápalos a todos! ⚡
