import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  DetailsPageContainer,
  PageHeader,
  TabsContainer,
  InformationsDetail,
} from "../components/layout/DetailsPageLayout";
import OverviewTab from "../components/tabs/project-details/OverviewTab";
import EventsTab from "../components/tabs/EventsTab";
import CompaniesTab from "../components/tabs/CompaniesTab";
import { projectsService, eventsService } from "../api/services";
import type { Project, Event } from "../types";
import { formatDate } from "../lib/dateUtils";

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [eventSearch, setEventSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [companySearch, setCompanySearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [project, setProject] = useState<Project | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch project details and their events
  useEffect(() => {
    const fetchProjectData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch project details
        const projectResponse = await projectsService.getById(Number(id));
        setProject(projectResponse.data);

        // Fetch events for this project
        const eventsResponse = await eventsService.getAll({
          project_id: Number(id),
        });
        setEvents(eventsResponse.data);
      } catch (err) {
        setError("Erro ao carregar projeto");
        console.error("Error fetching project data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  const handleEdit = () => {
    // Future: Open edit modal
    console.log("Edit project", id);
  };

  // Mock company data - replace with real data from API
  const MOCK_COMPANIES = [
    {
      id: 1,
      name: "Acme Productions",
      cnpj: "12.345.678/0001-90",
      role: "production",
      staffCount: 15,
    },
    {
      id: 2,
      name: "Tech Solutions",
      cnpj: "98.765.432/0001-10",
      role: "service",
      staffCount: 12,
    },
    {
      id: 3,
      name: "Event Masters",
      cnpj: "45.678.912/0001-34",
      role: "service",
      staffCount: 8,
    },
    {
      id: 4,
      name: "Creative Studios",
      cnpj: "32.165.498/0001-56",
      role: "production",
      staffCount: 5,
    },
    {
      id: 5,
      name: "Global Services",
      cnpj: "78.912.345/0001-78",
      role: "service",
      staffCount: 2,
    },
  ];

  // Example data - replace with real data from API when available
  const totalStaff = 42;
  const eventsStaff = [
    { name: "Evento 1", staffCount: 15 },
    { name: "Evento 2", staffCount: 12 },
    { name: "Evento 3", staffCount: 8 },
    { name: "Evento 4", staffCount: 5 },
    { name: "Evento 5", staffCount: 2 },
  ];

  if (loading) {
    return (
      <DetailsPageContainer>
        <div className="flex items-center justify-center h-64">
          <p className="text-subtitle">Carregando...</p>
        </div>
      </DetailsPageContainer>
    );
  }

  if (error || !project) {
    return (
      <DetailsPageContainer>
        <div className="flex items-center justify-center h-64">
          <p className="text-red-700">{error || "Projeto não encontrado"}</p>
        </div>
      </DetailsPageContainer>
    );
  }

  return (
    <DetailsPageContainer>
      <PageHeader title={project.name} subtitle="Projeto" onEdit={handleEdit} />

      <InformationsDetail>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-text-subtitle">
              Status
            </label>
            <p className="mt-1 text-text-title">
              {project.status === "open" ? "Aberto" : "Fechado"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-text-subtitle">
              Quantidade de Eventos
            </label>
            <p className="mt-1 text-text-title">{project.events_qnt || 0}</p>
          </div>
          {project.date_begin && (
            <div>
              <label className="text-sm font-medium text-text-subtitle">
                Data de Início
              </label>
              <p className="mt-1 text-text-title">
                {formatDate(project.date_begin)}
              </p>
            </div>
          )}
          {project.date_end && (
            <div>
              <label className="text-sm font-medium text-text-subtitle">
                Data de Término
              </label>
              <p className="mt-1 text-text-title">
                {formatDate(project.date_end)}
              </p>
            </div>
          )}
        </div>
      </InformationsDetail>

      <TabsContainer
        tabs={[
          {
            title: "Visão Geral",
            content: (
              <OverviewTab totalStaff={totalStaff} eventsStaff={eventsStaff} />
            ),
          },
          {
            title: "Eventos",
            content: (
              <EventsTab
                eventSearch={eventSearch}
                setEventSearch={setEventSearch}
                eventFilter={eventFilter}
                setEventFilter={setEventFilter}
                events={events}
              />
            ),
          },
          {
            title: "Empresas",
            content: (
              <CompaniesTab
                companySearch={companySearch}
                setCompanySearch={setCompanySearch}
                companyFilter={companyFilter}
                setCompanyFilter={setCompanyFilter}
                companies={MOCK_COMPANIES}
              />
            ),
          },
        ]}
        defaultTab="Visão Geral"
      />
    </DetailsPageContainer>
  );
};

export default ProjectDetailsPage;
