/**
 * NetOps CRM - Base Components
 * 
 * Componentes base reutilizables que definen estructura física
 * y comportamientos fundamentales de la UI.
 * 
 * Arquitectura: Base → Specialized
 * - Base: solo estructura física (Modal, Card, Panel, Form)
 * - Specialized: componentes de dominio que usan Base
 */

// ============================================================================
// BASE MODAL
// ============================================================================

export { 
  BaseModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalSection,
  ModalActions,
  type BaseModalProps,
  type ModalSize
} from "./BaseModal"

// ============================================================================
// BASE CARD
// ============================================================================

export { 
  BaseCard,
  CardHeader,
  CardContent,
  CardFooter,
  CardSkeletons,
  type BaseCardProps,
  type CardVariant,
  type CardSize
} from "./BaseCard"

// ============================================================================
// BASE PANEL
// ============================================================================

export { 
  BasePanel,
  PanelHeader,
  PanelBody,
  PanelFooter,
  type BasePanelProps,
  type PanelPosition,
  type PanelSize
} from "./BasePanel"

// ============================================================================
// BASE FORM
// ============================================================================

export { 
  BaseForm,
  FormHeader,
  FormField,
  FormRow,
  FormGroup,
  FormFooter,
  type BaseFormProps,
  type FormStatus,
  type FormFieldProps
} from "./BaseForm"

// ============================================================================
// BASE SIDE PANEL
// ============================================================================

export { 
  BaseSidePanel,
  SidePanelHeader,
  SidePanelContent,
  SidePanelSection,
  SidePanelFooter,
  type BaseSidePanelProps,
  type SidePanelPosition
} from "./BaseSidePanel"
